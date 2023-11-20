const mongodb = require('../../../database')

const onMessage = (io, socket, content) => {
    if (content == '') return
    if (content.length > 500) return

    io.emit('update_chat_message', { content: content, author: socket.character_name })

    mongodb.models.Message.collection.insertOne({
        content: content,
        author: socket.character_id,
        date: Date.now(),
        channel: 'global'
    })
}

module.exports = {
    onMessage
}