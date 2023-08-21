const mongodb = require('./database')
const auth = require('./auth')
const { Server } = require('socket.io')

const logic = require('./logic')

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

    process.on('SIGINT', () => {
        console.log('Arrêt du serveur en cours...');
      
        // Parcourez tous les clients connectés et envoyez un avis de déconnexion
        this.io.sockets.sockets.forEach(socket => {
          socket.disconnect(true); // Le paramètre true force la déconnexion
        });
      
        // Terminez le processus une fois que tous les clients sont déconnectés
          process.exit(0);
      })
    
    this.io.on('connection', (socket) => {
        let username = ''
        console.log('[socket] Nouvelle connexion établie.')

        // Événement de réception de messages
        socket.on('ask_player_move', (data) => {
            console.log(username + ' a demandé à bouger.')

            Player.findOne({ username: username }).then((player) => {
                logic.movePlayer(player, data.direction).then((result) => {
                    if (result == null) {
                        return
                    }

                    Player.updateOne({ username: username }, { coords: { x: player.coords.x, y: player.coords.y, direction: player.coords.direction } }).finally(() => {
                        socket.emit("set_player_position", { username: username, coords: player.coords, direction: player.coords.direction })
                        // this.io.emit except the current socket
                        socket.broadcast.emit("update_entitie_position", { username: username, coords: player.coords, direction: player.coords.direction })
                    })
                })
            })
        })

        socket.on('log_as', (token) => {
            username = auth.decodeToken(token)['username']
            console.log(username + ' vient de se connecter.')

            Player.findOne({ username: username }).then((player) => {
                if (player == null) {
                    socket.disconnect()

                    return
                }

                Player.find({ connected: true }).then((players) => {
                    // player
                    socket.emit('set_player_position', { username: username, coords: player.coords, direction: player.coords.direction })

                    // other entities
                    socket.emit('set_entities_position', players.filter((p) => p.username !== username))
                })
            })
        })

        setInterval(() => {
            Player.find({ connected: true }).then((players) => {
                socket.emit('set_entities_position', players.filter((p) => p.username !== username))
            })
        }, 1000)
    })
}