const socket = io('http://127.0.0.1:3000');

// Alterna entre os jogos
function switchGame(gameId) {
    document.querySelectorAll('.game-div').forEach(div => {
        div.style.display = 'none';
    });
    document.getElementById(gameId).style.display = 'block';
}

// Atualiza os lobbies em tempo real
socket.on('updateLobbies', (lobbies) => {
    ['cara-coroa', 'boxe', 'futebol'].forEach(gameType => {
        const container = document.querySelector(`.${gameType}-game`);
        container.innerHTML = '';

        if (lobbies[gameType]) {
            for (const roomId in lobbies[gameType]) {
                const room = lobbies[gameType][roomId];
                const button = document.createElement('button');
                button.textContent = room.roomName;
                button.onclick = () => alert(`Entrando na sala: ${roomId}`);
                container.appendChild(button);
            }
        }
    });
});

// Cria uma sala
function createRoom(gameType) {
    const roomName = prompt('Nome da Sala:');
    const duration = parseInt(prompt('Duração da sala (em milissegundos):'), 10);
    socket.emit('createRoom', { gameType, roomName, duration });
}
