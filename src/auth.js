const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const bcrypt = require('bcrypt')
const fs = require('fs')

const { ErrorCode } = require('./api/web/features/errors')

const SECRET_KEY = fs.readFileSync('./private.key', 'utf8')

// Fonction pour générer un token JWT
function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {
        algorithm: 'RS256' // Algorithme de signature
    })
}

// Fonction pour vérifier l'authenticité d'un token JWT
async function verifyTokenAuthenticity(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(new ErrorCode(403, "INVALID_TOKEN", "Invalid token."))
            } else {
                resolve(decoded)
            }
        })
    })
}

// Fonction pour décoder un token JWT
function decodeToken(token) {
    return jwt_decode(token);
}

// Fonction pour hacher un mot de passe
async function hashPassword(password) {
    const saltRounds = 10; // Nombre de "tour" du hachage (plus le nombre est élevé, plus c'est sécurisé mais plus c'est lent)
    const hash = await bcrypt.hash(password, saltRounds)

    return hash.toString();
}

// Fonction pour comparer les mots de passe
async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    generateToken,
    verifyTokenAuthenticity,
    decodeToken,
    hashPassword,
    comparePasswords
};