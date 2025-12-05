// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Send the username and cube position when a new user connects
  socket.on('newUser', (username) => {
    io.emit('userJoined', username);
  });

  // Listen for cube movement
  socket.on('moveCube', (position) => {
    io.emit('cubeMoved', position);
  });

  // Listen for new messages
  socket.on('newMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
