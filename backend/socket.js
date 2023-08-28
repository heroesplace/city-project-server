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
        console.log('[socket] Nouvelle connexion établie.')

        let payload = null

        socket.on('token_authentification', (token) => {
            auth.verifyTokenAuthenticity(token).then((decoded) => {
                if (decoded) {
                    payload = decoded

                    mongodb.models.Character.updateOne({ _id: payload["currentCharacter"] }, { connected: true }).then(() => {
                        console.log(payload["currentCharacter"] + ' vient de se connecter.')
                    })
                } else {
                    socket.disconnect()
                }
            })
        })

        // Événement de réception de messages
        socket.on('ask_player_move', (data) => {
            if (payload == null) return

            console.log(payload["currentCharacter"] + ' a demandé à bouger.')

            
            mongodb.models.Character.findOne({ _id: payload["currentCharacter"] }).then((character) => {
                logic.movePlayer(character, data.direction).then((result) => {
                    mongodb.models.Character.updateOne({ _id: payload["currentCharacter"] }, { coords: result }).then(() => {
                        if (result == null) return

                        // socket.emit("set_player_position", { currentCharacter: character._id, coords: result })
    
                        console.log({ currentCharacter: character._id, coords: result })
    
                        // this.io.emit except the current socket
                        // socket.broadcast.emit("update_entitie_position", { username: username, coords: result.coords, direction: result.coords.direction })
                    })
                })
            })

        })

        socket.on('log_as', (token) => {
            username = auth.decodeToken(token)['username']
            console.log(username + ' vient de se connecter.')

            mongodb.models.User.findOne({ username: username }).then((user) => {
                if (user == null) {
                    socket.disconnect()

                    return
                }

                mongodb.models.Character.findOne({ _id: user.currentCharacter }).then((character) => {
                    socket.emit('set_player_position', { username: username, coords: character.coords, direction: character.coords.direction })
                })
            })
        })

        /*
        // Chat events
        socket.on("send_message", (data) => {
            this.io.emit("receive_message", { username: username, message: data.message })
        })*/

        socket.on("disconnect", () => {
            console.log(payload["account_name"] + ' vient de se déconnecter.')

            mongodb.models.Character.updateOne({ _id: payload["currentCharacter"] }, { connected: false }).then(() => {
                console.log(payload["currentCharacter"] + ' vient de se déconnecter.')
            })
        })
    })

}