import db from '../../../database/postgresql/index.js'
import { VillageError } from '../../errors.js'

import { Channel } from '../../features/chat/channel.js'

class Village {
  constructor(socketSession, founderId, name) {
    this.socketSession = socketSession
    this.founderId = founderId
    this.name = name
  }

  // INFO : Dans cette fonction toutes les requêtes font partie de la même transaction
  // pour éviter que les vérifications soient obsolètes au moment des modifications
  async found() {
    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      // 1. Verifier si le founder est deja membre d'un village
      const r0 = await db.query('SELECT id FROM villages_members WHERE character_id = $1', [this.founderId])

      if (r0.rows.length !== 0) throw new VillageError('ALREADY_VILLAGER')

      // 2. Verifier si au moins 1 joueur a accepté la chart (sachant que le fondateur n'est pas dans la chart)
      const members = await db.query('SELECT receiver_id FROM charts WHERE sender_id = $1 AND status = 1', [this.founderId])

      if (members.rows.length === 0) throw new VillageError('EMPTY_CHART')

      // 3. On supprime la chart en supprimant tous les joueurs concernés de la table chart (peu importe leur réponse)
      await db.queryTransaction(client, 'DELETE FROM charts WHERE sender_id = $1', [this.founderId])

      // 4. On ajoute le village
      const village = await db.queryTransaction(client, 'INSERT INTO villages (name, founder_id) VALUES ($1, $2) RETURNING id', [this.name, this.founderId])

      // 5. On ajoute le fondateur au village
      await db.queryTransaction(client, 'INSERT INTO villages_members (village_id, character_id, role) VALUES ($1, $2, $3)', [village.rows[0].id, this.founderId, 0])

      // 6. On ajoute au village les joueurs ayant accepté la chart
      for (const member of members.rows) {
        await db.queryTransaction(client, 'INSERT INTO villages_members (village_id, character_id, role) VALUES ($1, $2, $3)', [village.rows[0].id, member.receiver_id, 1])
      }

      // 7. On ajoute le channel du village
      const channel = await db.queryTransaction(client, 'INSERT INTO channels (category) VALUES ($1) RETURNING id', [4])

      await db.queryTransaction(client, 'UPDATE villages SET channel_id = $1 WHERE id = $2', [channel.rows[0].id, village.rows[0].id])
      await client.query('COMMIT')

      console.log("[socket] Village created !")
    } catch (e) {
      await client.query('ROLLBACK')
      console.log(e)
    } finally {
      client.release()
    }
  }
}

export { Village }