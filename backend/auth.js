const mongodb = require('./database')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const bcrypt = require('bcrypt')

const Player = mongodb.models.Player

exports.SECRET_KEY = 'votre_clé_secrète'

exports.verifyToken = (req, res, next) => {
    if (!req.headers.cookie) {
        return res.redirect('/login')
    }

    console.log(req.headers.cookie)

    const token = req.headers.cookie.split('=')[1]

    if (!token) {
        return res.redirect('/login')
    }

    jwt.verify(token, this.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' })
        }
    
        req.user = decoded

        if (next !== undefined) next()
    })
}

exports.decodeToken = (token) => {
    return jwt_decode(token)
}

async function hashPassword(password) {
    const saltRounds = 10; // Nombre de "tour" du hachage (plus le nombre est élevé, plus c'est sécurisé mais plus c'est lent)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

module.exports.hashPassword = hashPassword

async function comparePasswords(password, hashedPassword) {
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    return passwordMatches;
}
  
module.exports.comparePasswords = comparePasswords

async function login(username, password) {
    return new Promise((resolve, reject) => {
        Player.findOne({ username: username }).then((player) => {
            if (player === null) {
                reject()
            } else {
                console.log(password, player.password)
                comparePasswords(password, player.password).then((passwordMatches) => {
                    if (passwordMatches) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            }
        })
    })
}

module.exports.login = login
