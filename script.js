const socket = io();
let username = '';
let cubePosition = { x: 50, y: 50 };

// Function to handle starting the game and setting the username
function startGame() {
  username = document.getElementById('usernameInput').value || 'User' + Math.floor(Math.random() * 1000);
  document.getElementById('usernameScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'flex';

  socket.emit('newUser', username);
}

// Function to move the cube based on arrow key inputs
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') cubePosition.y -= 5;
  if (e.key === 'ArrowDown') cubePosition.y += 5;
  if (e.key === 'ArrowLeft') cubePosition.x -= 5;
  if (e.key === 'ArrowRight') cubePosition.x += 5;

  socket.emit('moveCube', cubePosition);
  updateCubePosition();
});

// Update the position of the cube
function updateCubePosition() {
  const cube = document.getElementById('cube');
  cube.style.left = cubePosition.x + 'px';
  cube.style.top = cubePosition.y + 'px';
}

// Send a message to the chat room
function sendMessage(event) {
  if (event.key === 'Enter') {
    const message = document.getElementById('chatInput').value;
    socket.emit('newMessage', { username, message });
    document.getElementById('chatInput').value = '';
  }
}

// Listen for new messages and cube movements
socket.on('message', (message) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${message.username}: ${message.message}`;
  document.getElementById('messages').appendChild(messageElement);
});

socket.on('userJoined', (username) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = `${username} joined the chat!`;
  document.getElementById('messages').appendChild(messageElement);
});

socket.on('cubeMoved', (position) => {
  const otherCube = document.createElement('div');
  otherCube.style.width = '50px';
  otherCube.style.height = '50px';
  otherCube.style.backgroundColor = 'green';
  otherCube.style.position = 'absolute';
  otherCube.style.left = position.x + 'px';
  otherCube.style.top = position.y + 'px';
  document.getElementById('cubeContainer').appendChild(otherCube);
});
