const socket = io();

// Select DOM elements
const joinScreen = document.querySelector('.join-screen');
const chatScreen = document.querySelector('.chat-screen');
const joinButton = document.getElementById('join-user');
const exitButton = document.getElementById('exit-chat');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');
const messagesDiv = document.querySelector('.messages');
const usernameInput = document.getElementById('username');

let username = '';

// Join chatroom
joinButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    socket.emit('joinRoom', { username });
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = `Welcome, ${username}!`;
    joinScreen.classList.remove('active');
    chatScreen.classList.add('active');
  }
});



// Exit chatroom
exitButton.addEventListener('click', () => {
  socket.emit('leaveRoom', { username });
  chatScreen.classList.remove('active');
  joinScreen.classList.add('active');
});

// Send a chat message
sendMessageButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chatMessage', { username, message });
    addMessage('my-message', 'You', message);
    messageInput.value = '';
  }
}

// Listen for chat messages
socket.on('chatMessage', (data) => {
  addMessage('other-message', data.username, data.message);
});

// Listen for updates
socket.on('update', (message) => {
  addUpdate(message);
});

function addMessage(type, name, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', type);
  messageElement.innerHTML = `
    <div>
      <div class="name">${name}</div>
      <div class="text">${text}</div>
    </div>
  `;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addUpdate(message) {
  const updateElement = document.createElement('div');
  updateElement.classList.add('update');
  updateElement.textContent = message;
  messagesDiv.appendChild(updateElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
