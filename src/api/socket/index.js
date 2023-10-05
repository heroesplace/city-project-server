const { Server } = require('socket.io')

let options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}

exports.listen = (port, callback) => {
    this.io = new Server(port, options)

    callback()

    this.io.on('connection', (socket) => {
        console.log('[socket] Nouvelle connexion établie.')

        socket.on("ping", (callback) => {
            callback();
        });
    })
}