import db from '../../../database/postgresql/index.js'
import { pushMessage } from './chat/message.js'
import { processCommand } from './chat/command.js'

const pushChat = async (socket, author, message, channel) => {
  if (message === '' || message.length > 500) return

  // TODO: Check if channel exists and is authorized
  if (message.startsWith('/')) {
    processCommand(socket, author, message, channel)
  } else {
    pushMessage(socket, author, message, channel)
  }
}

const onPushChat = ({ socket, content }) => {
  pushChat(socket, socket.characterId, content.message, content.channel)
}

const pullChat = async (socket, channel) => {
  console.log(`[socket] Récupération du dernier message du channel ${channel}`)
  const request = await db.query('SELECT content, characters.name author FROM messages JOIN characters ON author = characters.id WHERE channel = $1 ORDER BY messages.id DESC LIMIT 1', [channel])

  const message = request.rows[0]

  socket.emit('update_chat_message', { content: message.content, author: message.author })
}

export { onPushChat, pullChat }
