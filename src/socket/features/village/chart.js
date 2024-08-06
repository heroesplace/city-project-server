import db from '../../../database/postgresql/index.js'

const onPullChartMembers = async ({ socketSession }) => {
  const senderId = await socketSession.getCharacter()

  await pullChartMembers(socketSession.socket, senderId)
}

const pullChartMembers = async (socket, senderId) => {
  const r = await db.query('SELECT name, status FROM charts JOIN characters ON receiver_id = characters.id WHERE sender_id = $1', [senderId])

  socket.emit('pull_chart_members', r.rows)
}

export { onPullChartMembers }