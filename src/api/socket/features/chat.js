import { saveMessage } from './chat/message.js'
import { processCommand } from './chat/command.js'

const pushChat = async (socket, author, message, channel) => {
  if (message === '' || message.length > 500) return

  // TODO: Check if channel exists and is authorized
  if (message.startsWith('/')) {
    processCommand(socket, author, message, channel)
  } else {
    saveMessage(author, message, channel)
  }
}

const onPushChat = ({ socket, content }) => {
  pushChat(socket, socket.characterId, content.message, content.channel)
}

export { onPushChat }
