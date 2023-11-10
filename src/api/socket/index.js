const { Server } = require('socket.io')
const mongoose = require('mongoose')

const auth = require('../../auth')

const { onMessage } = require('./features/chat')
const { onLoadMap } = require('./features/map')
const { onReplyToInvite, updateInvitesList } = require('../socket/features/invites')
const { onInviteCharacter } = require('../web/features/invites')
const { onPullMailbox } = require('../socket/features/mailbox')

let options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}

exports.io = null

const authSocketMiddleware = (socket, next) => {
    // since you are sending the token with the query
    const token = socket.handshake.auth.token

    auth.verifyTokenAuthenticity(token).then((decoded) => {
        socket.account_id = new mongoose.Types.ObjectId(decoded.account_id)
        socket.account_name = decoded.account_name
        socket.character_name = decoded.character_name
        socket.character_id = new mongoose.Types.ObjectId(decoded.character_id)

        socket.join(decoded.character_id)

        next()
    }).catch(err => {
        return next(err)
    })
}

exports.listen = (port, callback) => {
    const io = new Server(port, options)

    io.disconnectSockets()

    callback()

    io.use((socket, next) => {
        authSocketMiddleware(socket, next)
    })

    io.on('connection', (socket) => {
        console.log('[socket] Nouvelle connexion établie.')

        socket.on('ping', () => {
            socket.emit('pong')
        })

        // Client --> Push --> Server
        socket.on('push_chat_message', (content) => onMessage(io, socket, content))
        socket.on('push_invite_character', (character) => onInviteCharacter(io, socket, character))
        socket.on('push_invite_reply', (invite) => onReplyToInvite(io, socket, invite.sender, socket.character_id, invite.answer))

        // Client <-- Pull <-- Server
        socket.on('pull_map_part', (coords) => onLoadMap(socket, coords.direction))
        socket.on('pull_invite_members', (sender) => updateInvitesList(io, socket.character_id))
        socket.on('pull_character_mailbox', () => onPullMailbox(socket, socket.character_id))
    })
}