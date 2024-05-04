import db from '../../../database/index.js'

const onPushMessage = ({ io, socket, content }) => {
    pushMessage(io, content, socket.character_id)
}

const pushMessage = async (io, content, author) => {
    if (content === '' || content.length > 500) return

    console.log(`[socket] Message envoyé par ${author} : ${content}`)

    await db.query('INSERT INTO messages (content, author) VALUES ($1, $2)', [content, author])

    pullMessage(io, 'global')
}

const pullMessage = async (socket, channel) => {
    const request = await db.query('SELECT content, characters.name author FROM messages JOIN characters ON author = characters.id ORDER BY messages.id DESC LIMIT 1')

    const message = request.rows[0]

    socket.emit('update_chat', { content: message.content, author: message.author })
}

export { onPushMessage, pushMessage }
