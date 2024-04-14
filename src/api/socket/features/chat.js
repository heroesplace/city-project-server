const mongodb = require('../../../database')

const onPushMessage = (event) => {
    const { io, socket, content } = event

    pushMessage(io, content, socket.character_id)
}

const pushMessage = async (io, content, author) => {
    if (content == '') return
    if (content.length > 500) return

    console.log(`[socket] Message envoyé par ${author} : ${content}`)

   await new mongodb.models.Message({
        content: content,
        author: author,
        date: Date.now(),
        channel: 'global'
    }).save()

    pullMessage(io, 'global')
}

const pullMessage = async (socket, channel) => {
    // Get the 1 last message
    let message = await mongodb.models.Message.find({ channel: channel }).sort({ date: -1 }).limit(1)
    let author = await mongodb.models.Character.findOne({ _id: message[0].author })

    socket.emit('update_chat', {content: message[0].content, author: author.character_name})
}

module.exports = {
    onPushMessage,
    pushMessage
}