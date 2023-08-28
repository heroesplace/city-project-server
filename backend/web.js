
const { request  } = require('undici');
const { clientId, clientSecret, port } = require('./config/discord.json');

const path = require('path')
const express = require('express')
const jwt = require('jsonwebtoken')

const auth = require('./auth')
const account = require('./account')

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
    app.get('/game', auth.verifyToken, async ({ query }, res) => {
        const { code } = query;
    
        if (code) {
            try {
                const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: `http://localhost:${port}/game`,
                        scope: 'identify',
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
    
                const oauthData = await tokenResponseData.body.json();

                const userResult = await request('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                    },
                });

                
                console.log(await userResult.body.json());
            } catch (error) {
                // NOTE: An unauthorized token will not throw an error
                // tokenResponseData.statusCode will be 401
                console.error(error);
            }
        }

        res.sendFile(path.join(__dirname, '..', 'public', 'game', 'index.html'))
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
