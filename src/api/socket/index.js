import auth from '../../auth.js'
import { events } from './events.js'
import { Server } from 'socket.io' 
import db from '../../database/index.js'

let connections = {}
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

    console.log("[socket] Sessions : ", connections)
}

const authSocketMiddleware = (socket, next) => {
    let token = socket.handshake.query?.token

    if (token) {
        auth.verifyTokenAuthenticity(token).then(async (decoded) => {
            const r = await db.query('SELECT accounts.id account_id, accounts.name account_name, characters.id character_id, characters.name character_name FROM characters JOIN accounts ON account_id = accounts.id WHERE accounts.id = $1', [decoded.account_id])

            const infos = r.rows[0]

            socket.account_id = infos.account_id
            socket.account_name = infos.account_name

            socket.character_id = infos.character_id
            socket.character_name = infos.character_name

            socket.join(socket.character_id)

            next()
        }).catch(err => {
            return next(err)
        })
    } else {
        console.log('[socket] No token provided.')
    }
}

const listen = (server, allowedOrigin, callback) => {
    io = new Server(server, {
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
        console.log('[socket] Nouvelle connexion établie.')

        destroyPreviousSession(io, socket)

        for (const [event, handler] of Object.entries(events)) {
            socket.on(event, (content) => handler({ io: io, socket: socket, content: content }))
        }
    })
}

export default {
    listen,
    destroySession
}