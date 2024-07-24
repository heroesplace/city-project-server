import db from '../../../../database/postgresql/index.js'
import { processCommand } from './commands.js'

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

const isChannelMember = async (channelId, characterId) => {
  const res = await db.query('SELECT * FROM channels_members WHERE channel_id = $1 AND character_id = $2', [channelId, characterId])

  return res.rows.length !== 0
}

const onJoinChannel = async ({ socket, content }) => {
  const channelId = content.channelId

  joinChannel(socket, channelId)
}

const joinChannel = async (socket, channelId) => {
  if (!await isChannelMember(channelId, socket.characterId)) {
    // TODO : vérifier si le joueur est autorisé à rejoindre le channel
    try {
      await db.query('INSERT INTO channels_members (channel_id, character_id) VALUES ($1, $2)', [channelId, socket.characterId])

      console.log(`[socket] Character ${socket.characterId} joined channel ${channelId}`)
    } catch (e) {
      console.log(e)
    }
  }

  console.log("Joining socket room chat-" + channelId)
  socket.join("chat-" + channelId)
}

const onPushChatMessage = async ({ io, socket, content }) => {
  const channelId = content.channelId
  let message = content.message

  if (!message || message.length === 0) return

  if (message.length > 255) message = message.slice(0, 255)

  if (message.startsWith('/')) {
    processCommand({ io, socket, channelId, message })

    return
  }

  if (await isChannelMember(channelId, socket.characterId)) {
    // TODO : vérifier les permissions relatives au channel (mute, commandes, etc...)

    await db.query('INSERT INTO messages (channel_id, author, content) VALUES ($1, $2, $3)', [channelId, socket.characterId, message])

    io.to("chat-" + channelId).emit('update_chat_message', {
      gm: false,
      channelId,
      author: socket.characterName,
      content: message
    })
  }
}

export {
  createChannel,
  deleteChannel,
  onJoinChannel,
  joinChannel,
  onPushChatMessage
}