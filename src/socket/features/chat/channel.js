import db from '../../../database/postgresql/index.js'

class Channel {
  static async createChannel(categoryId) {
    try {
      const res = await db.query('INSERT INTO channels (category) VALUES ($1) RETURNING id', [categoryId])

      console.log(`[socket] Channel ${res.rows[0].id} créé.`)

      return res.rows[0].id
    } catch (error) {
      console.log(error)
    }
  }
}

const joinChannel = async (channelId, characterId) => {
  try {
    await db.query('INSERT INTO channels_members (channel_id, character_id) VALUES ($1, $2)', [channelId, characterId])

    console.log(`[socket] Character ${characterId} joined channel ${channelId}`)
  } catch (error) {
    console.log(error)
  }
}

const deleteChannel = async (channelId) => {
  try {
    await db.query('DELETE FROM channels WHERE id = $1', [channelId])

    console.log(`[socket] Channel ${channelId} supprimé.`)
  } catch (error) {
    console.log(error)
  }
}

export {
  deleteChannel,
  joinChannel,
  Channel
}