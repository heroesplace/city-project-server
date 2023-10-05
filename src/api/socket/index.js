const { Server } = require('socket.io')

let options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}

exports.handle = (server) => {
    this.io = new Server(server, options)

    this.io.on('connection', (socket) => {
        console.log('[socket] Nouvelle connexion établie.')
    })
}