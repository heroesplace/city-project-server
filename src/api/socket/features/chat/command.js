const processCommand = (socket, author, message, channel) => {
  const command = message.split(' ')[0].substring(1)

  switch (command) {
    case 'help':
      socket.emit('update_chat_command', 'HELP_COMMAND')
      break
    case 'clear':
      socket.emit('clear_chat')
      break
    default:
      socket.emit('update_chat_command', 'UNKNOWN_COMMAND')
  }
}

export { processCommand }
