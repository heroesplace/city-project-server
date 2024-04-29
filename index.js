const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socket = require('./src/api/socket')
const db = require('./src/database')

require('dotenv').config()

const app = express()
const server = http.createServer(app)

const allowedOrigin = (process.env.NODE_ENV === 'production' ? 'https' : 'http') + '://' + process.env.CLIENT_ADDRESS

const PORT = 3000

app.use((req, res, next) => {
  res.set({
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': '*'
  })

  next()
})

app.use(express.static('public', { dotfiles: 'allow' }))

// console.log("https://" + process.env.CLIENT_ADDRESS + ":" + process.env.CLIENT_PORT)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', require('./src/api/web/index'))

socket.listen(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
}, () => {
  console.log(`[ws] Serveur socket en écoute sur le port ${PORT}`)
})

// Lancement du serveur web
server.listen(PORT, () => {
  console.log(`[http] Serveur web en écoute sur le port ${PORT}`)
})