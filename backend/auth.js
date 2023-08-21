const mongodb = require('./database')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const bcrypt = require('bcrypt')
const fs = require('fs')

const Player = mongodb.models.Player

exports.SECRET_KEY = fs.readFileSync('./private_key.pem', 'utf8')

exports.generateToken = (payload) => {
    return jwt.sign(payload, this.SECRET_KEY, {
        algorithm: 'RS256', // Algorithme de signature
        expiresIn: '1h'     // Durée de validité du JWT
    })
}

exports.verifyToken = (req, res, next) => {
    if (!req.headers.cookie) {
        return res.redirect('/login')
    }

    const token = req.headers.cookie.split('=')[1]

    if (!token) {
        return res.redirect('/login')
    }

    jwt.verify(token, this.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/login')
        }
    
        req.user = decoded

        if (next !== undefined) next()
    })
}

exports.decodeToken = (token) => {
    return jwt_decode(token)
}

async function hashPassword(password) {
    const saltRounds = 10 // Nombre de "tour" du hachage (plus le nombre est élevé, plus c'est sécurisé mais plus c'est lent)
    return await bcrypt.hash(password, saltRounds)
}

module.exports.hashPassword = hashPassword

async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
}
  
module.exports.comparePasswords = comparePasswords

async function login(username, password) {
    return new Promise((resolve, reject) => {
        Player.findOne({ username: username }).then((player) => {
            if (player === null) {
                reject()
            } else {
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
