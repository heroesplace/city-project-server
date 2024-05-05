import auth from '../../auth.js'
import { events } from './events.js'
import { Server } from 'socket.io'
import db from '../../database/postgresql/index.js'

const sessions = {}
let io = null

const destroySession = (characterId) => {
  io.sockets.sockets.forEach((s) => {
    if (sessions[characterId] === s.id) {
      console.log('[socket] Déconnexion de la session précédente.')
      s.disconnect()
    }
  })
}

const destroyPreviousSession = (io, socket) => {
  io.sockets.sockets.forEach((s) => {
    if (sessions[socket.characterId] === s.id) {
      console.log('[socket] Déconnexion de la session précédente.')
      s.disconnect()
    }
  })

  sessions[socket.characterId] = socket.id

  console.log('[socket] Sessions : ', sessions)
}

const authSocketMiddleware = (socket, next) => {
  const token = socket.handshake.query?.token

  if (!token) {
    console.log('[socket] No token provided.')
    return
  }

  auth.verifyTokenAuthenticity(token).then(async (decoded) => {
    const r = await db.query('SELECT accounts.id account_id, accounts.name account_name, characters.id character_id, characters.name character_name FROM characters JOIN accounts ON account_id = accounts.id WHERE accounts.id = $1', [decoded.accountId])

    const infos = r.rows[0]

    socket.accountId = infos.account_id
    socket.accountName = infos.account_name

    socket.characterId = infos.character_id
    socket.characterName = infos.character_name

    socket.join(socket.characterId)

    next()
  }).catch(err => {
    return next(err)
  })
}

const listen = (server, allowedOrigin, callback) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ['GET', 'POST'],
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
      socket.on(event, (content) => handler({ io, socket, content }))
    }
  })
}

export default {
  listen,
  destroySession
}
