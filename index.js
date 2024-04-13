const http = require('http')
const socketIO = require('socket.io')
const express = require('express')
const bodyParser = require('body-parser')
const socket = require('./src/api/socket')

require("dotenv").config()

const app = express()
const server = http.createServer(app)

const allowedOrigin = (process.env.NODE_ENV === 'production' ? 'https' : 'http') + "://" + process.env.CLIENT_ADDRESS

const io = socketIO(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
})

const PORT = 3000

app.use((req, res, next) => {
  res.set({
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': true
  })
  
  next()
})

app.use(express.static('public', { dotfiles: 'allow' }))

//console.log("https://" + process.env.CLIENT_ADDRESS + ":" + process.env.CLIENT_PORT)

app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

app.use("/api", require('./src/api/web/index'))

// Connexion à la base de données
require('./src/database').connect(`mongodb://${process.env.DATABASE_ADDRESS || "localhost"}:27017/city-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5&readPreference=secondary`)

socket.listen(io, () => {
    console.log(`[ws] Serveur socket en écoute | wss://${process.env.SERVER_ADDRESS + ":" + PORT}`)
})

// Lancement du serveur web
server.listen(PORT, () => {
    console.log(`[http] Serveur web en écoute | http://${process.env.SERVER_ADDRESS + ":" + PORT}`)
})
