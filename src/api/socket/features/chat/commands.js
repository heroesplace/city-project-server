import { joinWhisperChannel } from './whispers.js'

const processCommand = async ({ io, socket, channelId, message }) => {
  const command = message.split(' ')[0].substring(1)
  const args = message.split(' ').slice(1)

  console.log(command, args)

  if (command === 'w') {
    if (!args[0]) return

    await joinWhisperChannel(io, socket.characterId, args[0])
  }
}

export {
  processCommand
}