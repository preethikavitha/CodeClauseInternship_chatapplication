const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (data) => {
    socket.username = data.username;
    io.emit('update', `${data.username} joined the chat`);
  });

  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', { username: data.username, message: data.message });
  });

  socket.on('leaveRoom', (data) => {
    io.emit('update', `${data.username} left the chat`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('update', `${socket.username} left the chat`);
    }
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
