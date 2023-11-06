const { Server } = require('socket.io')
const mongoose = require('mongoose')

const auth = require('../../auth')

const { onMessage } = require('./features/chat')
const { onLoadMap } = require('./features/map')
const { onReplyToInvitation, updateInvitationList } = require('../socket/features/invitations')
const { onInviteCharacter } = require('../web/features/invitations')

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

        socket.on('chat_message', (content) => onMessage(io, socket, content))
        socket.on('ask_map_part', (coords) => onLoadMap(socket, coords.direction))
        socket.on('invite_character', (character) => onInviteCharacter(io, socket, character))
        socket.on('reply_to_invitation', (invitation) => onReplyToInvitation(io, socket, invitation.sender, invitation.answer))
        socket.on("get_invitation_member_list", (sender) => updateInvitationList(io, socket.character_id))
    })
}