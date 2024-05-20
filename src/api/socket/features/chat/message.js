import db from '../../../../database/postgresql/index.js'
import { pullChat } from '../chat.js'

const pushMessage = async (socket, author, content, channel) => {
  console.log(`[socket] Message envoyé dans le channel ${channel} par ${author} : ${content}`)

  await db.query('INSERT INTO messages (author, content, channel) VALUES ($1, $2, $3)', [author, content, channel])

  pullChat(socket, channel)
}

export { pushMessage }
