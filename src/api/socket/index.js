const { Server } = require('socket.io')
const auth = require('../../auth')
const mongodb = require('../../database')

const map = require('../../game/map')

let options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}

const authSocketMiddleware = (socket, next) => {
    // since you are sending the token with the query
    const token = socket.handshake.auth.token

    auth.verifyTokenAuthenticity(token).then((decoded) => {
        socket.account_id = decoded.account_id

        next()
    }).catch(err => {
        return next(err);
    })
}

exports.listen = (port, callback) => {
    this.io = new Server(port, options)

    callback()

    this.io.use((socket, next) => {
        authSocketMiddleware(socket, next)
    })

    this.io.on('connection', (socket) => {
        console.log('[socket] Nouvelle connexion établie.')

        socket.on('ping', () => {
            socket.emit('pong')
        })

        socket.on('ask_map_part', (data) => {
            console.log(data)
            mongodb.models.Account.findOne({ _id: socket.account_id }).then((account) => {
                mongodb.models.Character.findOne({ owner: account._id }).then((character) => {

                    const newCoords = map.moveCamera(character, data.direction)

                    mongodb.models.Character.updateOne({ _id: character }, { coords: newCoords }).then(() => {
                        let newPart = map.calcNewPart(newCoords.x, newCoords.y, map.world_map)

                        // console.log(newPart)

                        socket.emit('map_part', { map_part: newPart })
                    })
                })
            })
        })
    })
}