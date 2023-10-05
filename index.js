const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socket = require('./src/api/socket')
const cors = require('cors')

const config = require('./config')

const app = express()
const server = http.createServer(app)

// Remove for production
app.use(cors({
    origin: '*'
}))

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use("/api", require('./src/api/web/index'))

// Connexion à la base de données
require('./src/database').connect(`mongodb://${config.DATABASE_ADDRESS}:27017/city-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5`)

socket.handle(server)

// Lancement du serveur web
server.listen(config.PORT, () => {
    console.log(`[http] Serveur en écoute | http://localhost:${config.PORT}`)
})