const net = require('net')
const express = require('express');
var path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', (socket) => {// connexion web - node
    const client = new net.Socket(); // connexion node - rust

    console.log('Nouvelle connexion');

    client.connect(8080, '127.0.0.1', () => {
        console.log('Connecté au serveur Rust');

        // Écouter l'événement "message"
        socket.on('message', (data) => {
            console.log(`Message reçu : ${data}`);
            client.write('{"type": "type1", "content" : "' + data.move +'"}');

            // Émettre un événement "message" à tous les clients connectés
            // io.emit('message', data);
        });
    });
    
    client.on('data', (data) => {
        console.log('Message reçu du serveur : ' + data);
    });
    
    client.on('close', () => {
        console.log('Connexion fermée');
    });
    
    client.on('error', (error) => {
        console.error('Erreur: ' + error.message);
    });    
});

http.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});