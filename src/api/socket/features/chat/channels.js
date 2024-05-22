import db from '../../../../database/postgresql/index.js'

const onJoinChannel = ({ socket, content }) => {
  if (isChannelMember(socket, content.channel)) return

  joinChannel(socket, content.channel)
}

const joinChannel = (socket, channel) => {
  console.log(`[socket] Joining channel ${channel}`)
  socket.join(channel)
}

const onPullChannelsList = ({ socket }) => {

}

const getChannelsList = async () => {
  const r = await db.query('SELECT id, name FROM channels')

  return r.rows[0]
}

const getChannelId = async (channel) => {
  const r = await db.query('SELECT id FROM channels WHERE name = $1', [channel])

  return r.rows[0].id
}

const isChannelMember = (socket, channel) => {
  return socket.rooms.has(channel)
}

export { onJoinChannel, onPullChannelsList, getChannelId, getChannelsList }