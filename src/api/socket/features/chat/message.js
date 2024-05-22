import db from '../../../../database/postgresql/index.js'
import { io } from '../../index.js'
import { getChannelId } from './channels.js'

const saveMessage = async (author, content, channel) => {
  console.log(`[socket] Message envoyé dans le channel ${channel} par ${author} : ${content}`)

  const channelId = await getChannelId(channel)

  await db.query('INSERT INTO messages (author, content, channel) VALUES ($1, $2, $3)', [author, content, channelId])

  pullLastMessage(channel)
}

const pullLastMessage = async (channel) => {
  const channelId = await getChannelId(channel)

  console.log(`[socket] Récupération du dernier message du channel ${channel}`)
  const request = await db.query('SELECT content, characters.name author FROM messages JOIN characters ON author = characters.id WHERE channel = $1 ORDER BY messages.id DESC LIMIT 1', [channelId])

  const message = request.rows[0]

  io.to(channel).emit('update_chat_message', {
    content: message.content,
    author: message.author,
    channel: channel,
    gm: true
  })
}

export { saveMessage, pullLastMessage }
