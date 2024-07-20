import db from '../../../database/postgresql/index.js'
import { isVillager } from './character.js'

import { UniqueConstraintError } from '../../../database/postgresql/errors.js'
import { CharacterError, VillageError } from '../errors.js'

import { createChannel, deleteChannel } from './chat/channels.js'

const onCreateVillage = async ({ socket, content }) => {
  try {
    await createVillage(content.name, socket.characterId)
  } catch (error) {
    console.log(error)
  }
}

const createVillage = async (name, founderId) => {
  name = name.toLowerCase()

  try {
    await isVillager(founderId).then((result) => {
      if (result) throw new CharacterError('IS_VILLAGE_MEMBER')
    })

    // 4 is the category for villages
    const channelId = await createChannel(4, founderId)

    const res = await db.query('INSERT INTO villages (name, founder_id, channel_id) VALUES ($1, $2, $3) RETURNING id', [name, founderId, channelId])

    joinVillage(res.rows[0].id, founderId, 0)

    console.log(`[socket] Village ${name} créé par ${founderId}`)
  } catch (e) {
    if (e instanceof UniqueConstraintError) throw new VillageError('VILLAGE_NAME_TAKEN')
    throw e
  }
}

const joinVillage = async (villageId, characterId, role) => {
  try {
    await isVillager(characterId).then((result) => {
      if (result) throw new CharacterError('IS_VILLAGE_MEMBER')
    })

    await db.query('INSERT INTO villages_members (village_id, character_id) VALUES ($1, $2)', [villageId, characterId])

    console.log(`[socket] Character ${characterId} joined village ${villageId}`)
  } catch (e) {
    console.log(e)
  }
}

const getVillage = async (villageId) => {
  try {
    const res = await db.query('SELECT * FROM villages WHERE id = $1', [villageId])

    return res.rows[0]
  } catch (e) {
    console.log(e)
  }
}

const deleteVillage = async (villageId) => {
  const channelId = await getVillage(villageId).channel_id

  await deleteChannel(channelId)

  await db.query('DELETE FROM villages WHERE id = $1', [villageId])
}

export {
  onCreateVillage,
  createVillage,
  deleteVillage
}
