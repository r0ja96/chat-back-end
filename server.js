const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

let allUsers = [];

io.on('connection', (socket) => {

    socket.on('enterChat', (data) => {
        const { username, id } = data;
        allUsers.push({ id, username });
        io.emit('newUser', { allUsers });
    });

    socket.on('sendMessage', (data) => {
        const { to, msg } = data;
        io.emit(to, { msg });
    })

    socket.on('disconnect', () => {
        allUsers = allUsers.filter((value) => {
            return !(socket.id == value.id);
        })

        io.emit('newUser', { allUsers });
    })

});

server.listen(4000, () => { console.log('Server is running on port 4000') });