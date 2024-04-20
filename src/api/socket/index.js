const auth = require('../../auth')
const events = require('./events').events
const socketIO = require('socket.io')

let connections = []
let io = null

const destroySession = (character_id) => {
    io.sockets.sockets.forEach((s) => {
        if (connections[character_id] == s.id) {
            console.log('[socket] Déconnexion de la session précédente.')
            s.disconnect()
        }
    })
}

const destroyPreviousSession = (io, socket) => {
    io.sockets.sockets.forEach((s) => {
        if (connections[socket.character_id] == s.id) {
            console.log('[socket] Déconnexion de la session précédente.')
            s.disconnect()
        }
    })

    connections[socket.character_id] = socket.id

    console.log(connections)
}

const authSocketMiddleware = (socket, next) => {
    let token = socket.handshake.query?.token

    if (token) {
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
    } else {
        console.log('[socket] No token provided.')
    }
}

const listen = (server, allowedOrigin, callback) => {
    io = socketIO(server, {
        cors: {
          origin: allowedOrigin,
          methods: ["GET", "POST"],
          credentials: true
        }
    })
    
    io.disconnectSockets()

    callback()

    io.use((socket, next) => authSocketMiddleware(socket, next))

    io.on('connection', (socket) => {
        destroyPreviousSession(io, socket)

        console.log('[socket] Nouvelle connexion établie.')

        for (const [event, handler] of Object.entries(events)) {
            socket.on(event, (content) => handler({ io: io, socket: socket, content: content }))
        }
    })
}


module.exports = {
    listen,
    destroySession
}