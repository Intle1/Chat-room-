const socket = io(); // Connect to the server

const loginScreen = document.getElementById('login-screen');
const chatContainer = document.getElementById('chat-container');
const adultChatScreen = document.getElementById('adult-chat-screen');
const storageScreen = document.getElementById('storage-screen');
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const loginButton = document.getElementById('login-button');
const messagesDiv = document.getElementById('messages');
const adultMessagesDiv = document.getElementById('adult-messages');
const storageLogsDiv = document.getElementById('storage-logs');
const messageInput = document.getElementById('message-input');
const adultMessageInput = document.getElementById('adult-message-input');
const sendButton = document.getElementById('send-button');
const adultSendButton = document.getElementById('adult-send-button');
const switchToAdultChatButton = document.getElementById('switch-to-adult-chat');
const switchToStorageButton = document.getElementById('switch-to-storage');
const backToMainChatButton = document.getElementById('back-to-main-chat');
const backToChatFromStorageButton = document.getElementById('back-to-chat-from-storage');
const fileUpload = document.getElementById('file-upload');

let username = '';
let email = '';
let chatLogs = {
    mainChat: [],
    adultChat: []
};

// Handle user login
loginButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    email = emailInput.value.trim();
    if (!username || !email) return alert('Please provide valid credentials!');
    loginScreen.classList.remove('active');
    chatContainer.classList.add('active');
});

// Send main chat message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message) return;
    const data = { username, message };
    socket.emit('chat message', data); // Send to server
    messageInput.value = '';
});

// Send adult chat message
adultSendButton.addEventListener('click', () => {
    const message = adultMessageInput.value.trim();
    if (!message) return;
    const data = { username, message };
    socket.emit('adult chat message', data); // Send to server
    adultMessageInput.value = '';
});

// Receive main chat messages
socket.on('chat message', (data) => {
    messagesDiv.innerHTML += `<div>${data.username}: ${data.message}</div>`;
});

// Receive 18+ chat messages
socket.on('adult chat message', (data) => {
    adultMessagesDiv.innerHTML += `<div>${data.username}: ${data.message}</div>`;
});

// Handle navigation
switchToAdultChatButton.addEventListener('click', () => {
    chatContainer.classList.remove('active');
    adultChatScreen.classList.add('active');
});

backToMainChatButton.addEventListener('click', () => {
    adultChatScreen.classList.remove('active');
    chatContainer.classList.add('active');
});

switchToStorageButton.addEventListener('click', () => {
    chatContainer.classList.remove('active');
    storageScreen.classList.add('active');
    displayChatLogs();
});

backToChatFromStorageButton.addEventListener('click', () => {
    storageScreen.classList.remove('active');
    chatContainer.classList.add('active');
});

// Handle file uploads
fileUpload.addEventListener('change', (event) => {
    const files = event.target.files;
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                adultMessagesDiv.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = file.name;
            link.textContent = `Download: ${file.name}`;
            adultMessagesDiv.appendChild(link);
        }
    }
});

// Utility to display chat logs
function displayChatLogs() {
    storageLogsDiv.innerHTML = '<h3>Main Chat Logs:</h3>' + chatLogs.mainChat.map(log => `<div>${log}</div>`).join('');
    storageLogsDiv.innerHTML += '<h3>18+ Chat Logs:</h3>' + chatLogs.adultChat.map(log => `<div>${log}</div>`).join('');
}
