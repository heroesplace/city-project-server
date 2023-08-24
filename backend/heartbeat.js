const mongodb = require('./database')

exports.start = (io) => {
    const heartbeatFrequency = 1 / 30 * 1000 // 30Hz

    // Heartbeat
    setInterval(function() {
        // Envoi de la liste des utilisateurs connectés aux clients
        mongodb.models.Character.find({ connected: true }).then((characters) => {
            // console.log(characters)
            io.emit('tickrate', characters)
        })
    }, heartbeatFrequency)
}