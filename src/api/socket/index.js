const auth = require('../../auth')
const events = require('./events').events

const authSocketMiddleware = (socket, next) => {
    try {
        if (!socket.handshake.auth.token && !socket.handshake.headers.cookie) {
            throw new Error('No token provided')
        }
    } catch (err) {
        return next(err)
    }
    
    const token = socket.handshake.auth.token || socket.handshake.headers.cookie.split("=")[1].split(";")[0] || null

    auth.verifyTokenAuthenticity(token).then((decoded) => {
        socket.account_id = decoded.account_id
        socket.account_name = decoded.account_name
        socket.character_name = decoded.character_name
        socket.character_id = decoded.character_id

        socket.join(decoded.character_id)

        next()
    }).catch(err => {
        return next(err)
    })
}

const listen = (io, callback) => {
    io.disconnectSockets()

    callback()

    io.use((socket, next) => {
        authSocketMiddleware(socket, next)
    })

    io.on('connection', (socket) => {
        console.log('[socket] Nouvelle connexion établie.')

        for (const [event, handler] of Object.entries(events)) {
            socket.on(event, (content) => handler({ io: io, socket: socket, content: content }))
        }
    })
}

module.exports = {
    getIo: () => io,
    listen,
}