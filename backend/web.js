const path = require('path')
const express = require('express')
const jwt = require('jsonwebtoken')

const auth = require('./auth')

exports.expose = (app) => {

    app.use('/game/assets', express.static(path.join(__dirname, '../public/game/assets')))

    app.use(express.urlencoded({
        extended: true
    }))

    // Home
    app.get('/', (req, res) => {
        res.sendFile(__dirname, '..', 'public', 'index.html')
    })

    // Login
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'login', 'index.html'))
    })

    // Route pour la création d'un token JWT après authentification
    app.post('/login', (req, res) => {
        const { username, password } = req.body;
    
        // Vérification des informations d'identification (exemple basique)
        if (username === 'user' && password === 'password') {
            const token = jwt.sign({ username }, auth.SECRET_KEY)
            
            res.cookie('jwt_token', token, {
                expires  : new Date(Date.now() + 9999999),
                httpOnly : false
            })
            
            res.status(200).send({ token: token })
        } else {
            res.status(401).json({ message: 'Identifiants invalides' })
        }
    })

    // Game
    app.get('/game', auth.verifyToken, (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'game', 'index.html'))
    })
}
