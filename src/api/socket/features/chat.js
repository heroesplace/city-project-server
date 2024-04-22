const db = require('../../../database')

const onPushMessage = (event) => {
    const { io, socket, content } = event

    pushMessage(io, content, socket.character_id)
}

const pushMessage = async (io, content, author) => {
    if (content == '') return
    if (content.length > 500) return

    console.log(`[socket] Message envoyé par ${author} : ${content}`)

    await db.query('INSERT INTO messages (content, author) VALUES ($1, $2)', [content, author])

    pullMessage(io, 'global')
}

const pullMessage = async (socket, channel) => {
    // Get the 1 last message, select content author
    const request = await db.query('SELECT content, characters.name author FROM messages JOIN characters ON author = characters.id ORDER BY messages.id DESC LIMIT 1')

    const message = request.rows[0]

    console.log(message)

    socket.emit('update_chat', {content: message.content, author: message.author })
}

module.exports = {
    onPushMessage,
    pushMessage
}