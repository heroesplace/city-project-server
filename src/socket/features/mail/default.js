import db from '../../../database/postgresql/index.js'
import { Character } from '../character/default.js'
import { MailError } from './errors.js'
import { Chart } from '../village/default.js'
import { VillageError } from '../village/errors.js'

class Mail {
  constructor(session, senderId, receiverId, category) {
    this.session = session
    this.category = category
    this.senderId = senderId
    this.receiverId = receiverId
  }

  async sendMail() {
    if (this.senderId === this.receiverId) throw new MailError('SELF_MAIL')

    await Character.resolve(this.receiverId)

    await db.query('INSERT INTO mails (sender_id, receiver_id, category) VALUES ($1, $2, $3)', [this.senderId, this.receiverId, this.category])

    console.log(`[socket] Invitation de ${this.senderId} à ${this.receiverId}`)

    this.session.manager.io.to(this.session.manager.getSessionIdByCharacterId(this.receiverId)).emit('ask_pull_mails')
  }

  static async pullMails(receiverId) {
    const r = await db.query('SELECT mails.id id, mails.creation_date date, name, category  FROM mails JOIN characters ON sender_id = characters.id WHERE receiver_id = $1', [receiverId])

    return r.rows
  }

  async replyMail(answer) {
    // await db.query('UPDATE mails SET opened = $1 WHERE sender_id = $2 AND receiver_id = $3', [answer ? 1 : 2, this.senderId, this.receiverId])

    console.log(`[socket] Réponse à l'invitation de ${this.senderId} à ${this.receiverId} : ${answer}`)
  }
}

class MailChart extends Mail {
  constructor(session, senderId, receiverId) {
    super(session, senderId, receiverId, 'chart')
  }

  async sendMail() {
    if (!await Chart.isAllowedToSendInvite(this.senderId)) throw new VillageError('NOT_ALLOWED_TO_SEND_INVITE')
    if (!await Chart.isAllowedToReceiveInvite(this.receiverId)) throw new VillageError('NOT_ALLOWED_TO_RECEIVE_INVITE')

    const r = await db.query('SELECT id FROM charts WHERE sender_id = $1 AND receiver_id = $2', [this.senderId, this.receiverId])

    if (r.rows.length !== 0) throw new MailError('ALREADY_INVITED')

    await super.sendMail()

    await db.query('INSERT INTO charts (sender_id, receiver_id) VALUES ($1, $2) RETURNING id', [this.senderId, this.receiverId])

    this.session.socket.emit('ask_pull_chart_members') // Update sender list
  }

  async replyMail(answer) {
    super.replyMail(answer)

    const client = await db.getClient()

    try {
      await client.query('BEGIN')

      const s = await db.queryTransaction(client, 'UPDATE charts SET status = 2 WHERE receiver_id = $1 RETURNING sender_id', [this.receiverId]) // Quit last chart
      await db.queryTransaction(client, 'UPDATE charts SET status = $1 WHERE sender_id = $2 AND receiver_id = $3', [answer ? 1 : 2, this.senderId, this.receiverId])
      await db.queryTransaction(client, 'DELETE FROM mails WHERE sender_id = $1 AND receiver_id = $2', [this.senderId, this.receiverId])

      await client.query('COMMIT')

      for (const chart of s.rows) {
        this.session.manager.io.to(this.session.manager.getSessionIdByCharacterId(chart.sender_id)).emit('ask_pull_chart_members')  // Update sender list
      }
    } catch (e) {
      await client_encoding.query('ROLLBACK')
      console.log(e)
    } finally {
      client.release()
    }

    this.session.socket.emit('ask_pull_mails')

    this.session.manager.io.to(this.session.manager.getSessionIdByCharacterId(this.senderId)).emit('ask_pull_chart_members')  // Update sender list
  }
}

export { Mail, MailChart }