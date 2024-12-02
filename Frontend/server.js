const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let lobbies = {}; // Armazena salas por jogo

io.on('connection', (socket) => {
    console.log('Jogador conectado:', socket.id);

    // Criação de uma sala
    socket.on('createRoom', ({ gameType, roomName, duration }) => {
        if (!lobbies[gameType]) {
            lobbies[gameType] = {}; // Inicializa o jogo se ainda não existir
        }

        const roomId = Date.now();
        lobbies[gameType][roomId] = { roomName, expiresAt: Date.now() + duration };

        // Notifica os clientes sobre a atualização
        io.emit('updateLobbies', lobbies);

        // Remove a sala após expirar
        setTimeout(() => {
            delete lobbies[gameType][roomId];
            io.emit('updateLobbies', lobbies);
        }, duration);
    });

    socket.on('disconnect', () => {
        console.log('Jogador desconectado:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
