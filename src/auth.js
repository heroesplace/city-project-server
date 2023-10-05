const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const bcrypt = require('bcrypt')
const fs = require('fs')

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
                reject()
            } else {
                resolve(decoded)
            }
        })
    })
}

// Middleware pour vérifier le token JWT
// Verifie que le token est bien présent
// ET que le token est valide
async function verifyToken(req, res) {
    return new Promise((resolve, reject) => {
        if (!req.headers.cookie) reject()
    
        const token = req.headers.cookie.split('=')[1];
    
        if (!token) reject()

        verifyTokenAuthenticity(token).then(() => {
            resolve(decodeToken(token))
        }).catch(() => {
            reject()
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
    return await bcrypt.hash(password, saltRounds);
}

// Fonction pour comparer les mots de passe
async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    generateToken,
    verifyToken,
    verifyTokenAuthenticity,
    decodeToken,
    hashPassword,
    comparePasswords
};