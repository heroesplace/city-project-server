const mongodb = require('./database')
const auth = require('./auth')
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

                Player.updateOne({ username: username }, { coords: { x: player.coords.x, y: player.coords.y } }).finally(() => {
                    this.io.emit("set_player_position", player)
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
                    this.io.emit('players_list', players)
                })
            })
        })
    })
}