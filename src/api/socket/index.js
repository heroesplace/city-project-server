import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-streams-adapter'

import { getAdapterClient } from '../../database/redis/index.js'
import { events } from './events.js'
import db from '../../database/postgresql/index.js'
import auth from '../../auth.js'

class SocketManager {
  constructor() {
    this.sessions = {}
    this.io = null
  }

  getSessions = () => {
    console.log("oui voila")
    console.log(this.sessions)
    return this.sessions
  }

  getOthersSessions = (socket) => {
    return Object.keys(this.sessions).filter(key => key !== socket.characterId.toString())
  }

  destroyPreviousSession(socket) {
    this.io.sockets.sockets.forEach((s) => {
      if (this.sessions[socket.characterId] === s.id) {
        console.log('[socket] Déconnexion de la session précédente.')
        s.disconnect()
      }
    })

    this.sessions[socket.characterId] = socket.id

    console.log('[socket] Sessions : ', this.sessions)
  }

  async authSocketMiddleware(socket, next) {
    const header = socket.handshake.headers.authorization

    if (!header) return next(new Error('no token'))

    if (!header.startsWith('Bearer ')) return next(new Error('invalid token'))

    const token = header.substring(7)

    try {
      const decoded = await auth.verifyTokenAuthenticity(token)
      const r = await db.query('SELECT accounts.id account_id, accounts.name account_name, characters.id character_id, characters.name character_name FROM characters JOIN accounts ON account_id = accounts.id WHERE accounts.id = $1', [decoded.accountId])

      const infos = r.rows[0]

      socket.accountId = infos.account_id
      socket.accountName = infos.account_name
      socket.characterId = infos.character_id
      socket.characterName = infos.character_name

      // socket.join(socket.characterId)

      next()
    } catch (err) {
      return next(err)
    }
  }

  listen(server, allowedOrigin, callback) {
    const client = getAdapterClient()

    this.io = new Server(server, {
      adapter: createAdapter(client),
      cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    this.io.disconnectSockets()

    callback()

    this.io.use((socket, next) => this.authSocketMiddleware(socket, next))

    this.io.on('connection', (socket) => {
      console.log('[socket] Nouvelle connexion établie.')

      this.destroyPreviousSession(socket)

      for (const [event, handler] of Object.entries(events)) {
        socket.on(event, (content) => handler({ io: this.io, socket, content }))
      }

      socket.conn.on("close", (reason) => {
        // Character dispawn
      })
    })
  }
}

const socketManager = new SocketManager()

export default socketManager
export const {
  io,
  getSessions,
  getOthersSessions
} = socketManager
