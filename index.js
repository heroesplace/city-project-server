const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socket = require('./src/api/socket')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

// Remove for production
app.use(cors({ 
    origin: "*",
    credentials: true
}))

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use("/api", require('./src/api/web/index'))

// Connexion à la base de données
require('./src/database').connect(`mongodb://${process.env.DATABASE_ADDRESS || "192.168.1.90"}:27017/city-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5`)

socket.listen(3001, () => {
    console.log(`[socket] Serveur en écoute | http://localhost:3001`)
})

// Lancement du serveur web
server.listen(3000, () => {
    console.log(`[http] Serveur en écoute | http://localhost:3000`)
})