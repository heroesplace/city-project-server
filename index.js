const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socket = require('./src/api/socket')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

require("dotenv").config()

// Remove for production
app.use(cors({ 
    origin: "http://" + process.env.CLIENT_ADDRESS + ":" + process.env.CLIENT_PORT,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))

console.log("http://" + process.env.CLIENT_ADDRESS + ":" + process.env.CLIENT_PORT)

app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

app.use("/api", require('./src/api/web/index'))

// Connexion à la base de données
require('./src/database').connect(`mongodb://${process.env.DATABASE_ADDRESS || "localhost"}:27017/city-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5`)

socket.listen(process.env.SOCKET_PORT, () => {
    console.log(`[ws] Serveur socket en écoute | ws://${process.env.SERVER_ADDRESS + ":" + process.env.SOCKET_PORT}`)
})

// Lancement du serveur web
server.listen(process.env.WEB_PORT, () => {
    console.log(`[http] Serveur web en écoute | http://${process.env.SERVER_ADDRESS + ":" + process.env.WEB_PORT}`)
})