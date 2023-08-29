

const path = require('path')
const express = require('express')
const jwt = require('jsonwebtoken')

const auth = require('./auth')
const account = require('./account');

const discord = require('./discord')

exports.expose = (app) => {
    // Middlewares
    app.use(express.urlencoded({
        extended: true
    }))

    // Static files
    app.use('/game/assets', express.static(path.join(__dirname, '../public/game/assets')))

    // Home
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
    })

    // Game
    app.get('/game', (req, res) => {
        auth.verifyToken(req, res).then((decoded) => {
            const code = req.query.code
            
            if (code) {
                console.log(decoded)
                discord.link(code, decoded["account_id"])
            }
            
            res.sendFile(path.join(__dirname, '..', 'public', 'game', 'index.html'))
        }).catch(() => {
            res.redirect('/login')
        })
    })

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'account', 'register', 'index.html'))
    })

    app.post('/register', (req, res) => {
        const { account_name, character_name, email_address, password } = req.body

        account.register(account_name, character_name, email_address, password).then(() => {
            console.log("[auth] Compte créé")

            res.status(200).json({ message: 'Compte créé' })
        }).catch(() => {
            console.log("[auth] Compte déjà existant")

            res.status(401).json({ message: 'Compte déjà existant' })
        })
    })

    // Login page
    app.get('/login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'account', 'login', 'index.html'))
    })

    // Login
    app.post('/login', (req, res) => {
        const { username, password } = req.body
    
        // Vérification des informations d'identification (exemple basique)
        account.login(username, password).then((token) => {
            console.log("[auth] Identifiants valides")

            res.cookie('jwt_token', token, {
                expires  : new Date(Date.now() + 9999999),
                SameSite: 'Strict',
                httpOnly : false
            })
            
            res.status(200).send({ token: token })
        }).catch(() => {
            console.log("[auth] Identifiants invalides")

            res.status(401).json({ message: 'Identifiants invalides' })
        })
    })
}
