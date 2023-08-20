const mongodb = require('./database')
const { Server } = require('socket.io')

const Player = mongodb.models.Player

exports.io = null

exports.handle = (server) => {
    let options = {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }

    this.io = new Server(server, options)
    
    this.io.on('connection', (socket) => {
        console.log('Nouvelle connexion Socket.IO établie.');

        // Événement de réception de messages
        socket.on('ask_player_move', (data) => {
            console.log(data)

            Player.findOne({ username: data.username }).then((player) => {
                switch (data.direction) {
                    case "left": // Touche de gauche
                        player.coords.x -= 32
                        break;
                    case "top": // Touche du haut
                        player.coords.y -= 32
                        break;
                    case "right": // Touche de droite
                        player.coords.x += 32
                        break;
                    case "bottom": // Touche du bas
                        player.coords.y += 32
                        break;
                }

                Player.updateOne({ username: data.username }, { coords: { x: player.coords.x, y: player.coords.y } }).finally(() => {
                    this.io.emit("set_player_position", player)
                })
            })
        })

        socket.on('log_as', (username) => {
            console.log(username + ' vient de se connecter.')

            Player.find({ connected: true }).then((players) => {
                this.io.emit('players_list', players)
            })

        })
    })
}