const mongodb = require('./database')

exports.start = (io) => {
    const heartbeatFrequency = 1 / 60 * 1000 // 60 Hz
    
    const Player = mongodb.models.Player

    // Heartbeat
    setInterval(function() {
        // Envoi de la liste des utilisateurs connectés aux clients

        Player.find({ connected: true }).then((players) => {
            // other entities
            io.emit('tickrate', players)
        })

    }, heartbeatFrequency)
}