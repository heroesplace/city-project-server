const mongoose = require('mongoose')

const { models } = require('./models')

function connect(uri) {
    console.log("[mongodb] Tentative de connexion à la base de données..")

    mongoose.connect(uri).then(
        () => {
            console.log("[mongodb] Connexion à la base de données réussie !")
        },
        err => {
            console.log("[mongodb] Echec de la connexion à la base de données !")

            process.exit(1)
        }
    )
}

module.exports = {
    connect,
    models
}