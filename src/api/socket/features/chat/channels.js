import db from '../../../../database/postgresql/index.js'

const createChannel = async (categoryId, founderId) => {
  try {
    const res = await db.query('INSERT INTO channels (category) VALUES ($1) RETURNING id', [categoryId])

    console.log(`[socket] Channel ${res.rows[0].id} créé.`)

    return res.rows[0].id
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
  createChannel,
  deleteChannel
}