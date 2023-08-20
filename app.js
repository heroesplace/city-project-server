const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Autorise toutes les origines
    methods: ["GET", "POST"]
  }
})

const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

let database_connected_players = [
    {
        "username": "soleo",
        "coords": {
            "x": 208, 
            "y": 112
        }
    },
    {
        "username": "aniwen",
        "coords": {
            "x": 176, 
            "y": 112
        }
    }
]

io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.IO établie.');

  // Événement de réception de messages
  socket.on('message', (data) => {
    console.log(data)
    
    io.emit("message", data)
  })

  socket.on('log_as', (username) => {
    console.log(username + ' vient de se connected.')

    io.emit('players_list', database_connected_players)
  })
})

server.listen(port, () => {
  console.log(`Serveur Socket.IO en écoute sur le port ${port}`);
})
