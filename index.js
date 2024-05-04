import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import socket from './src/api/socket/index.js'
import dotenv from 'dotenv'
import apiRouter from './src/api/web/index.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

const allowedOrigin = `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.CLIENT_ADDRESS}`

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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiRouter)

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