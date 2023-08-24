const http = require('http')
const express = require('express')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",  // Autorise toutes les origines
        methods: ["GET", "POST"]
    }
})

const PORT = 3000

// Exposition des fichiers statiques
require('./backend/web').expose(app)

// Connexion à la base de données
require('./backend/database').connect('mongodb://127.0.0.1:27017/city-project?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5')

// Gestion des sockets
const socket = require('./backend/socket')
const heartbeat = require('./backend/heartbeat')

socket.handle(server)

heartbeat.start(socket.io)

// Lancement du serveur web
server.listen(PORT, () => {
    console.log(`[http] Serveur en écoute sur le port ${PORT}`);
})