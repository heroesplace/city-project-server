const mongoose = require('mongoose')

exports.models = { 
	Player: mongoose.model('Player', {
        username: String,
        coords: {
            x: Number,
            y: Number
        }
	})
}

exports.connect = (uri) => {
    console.log("Tentative de connexion à la base de données..")

    mongoose.connect(uri).then(
        () => {
            console.log("Connexion à la base de données réussie !")
        },
        err => {
            console.log("Echec de la connexion à la base de données !")

            process.exit(1)
        }
    )
}