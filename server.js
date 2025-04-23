const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = {};
let messages = [];

app.use(express.static('public'));

wss.on('connection', (ws) => {
  console.log('a user connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'join') {
      users[ws._socket._id] = data.username;
      broadcast({ type: 'message', sender: 'System', message: `${data.username} has joined the chat.` });
      // Send all previous messages to the new user
      messages.forEach((msg) => {
        ws.send(JSON.stringify(msg));
      });
    } else if (data.type === 'message') {
      const username = users[ws._socket._id];
      const timestamp = new Date().toLocaleString();
      const messageObject = { type: 'message', sender: username, message: data.message, timestamp };
      messages.push(messageObject);
      broadcast(messageObject);
    }
  });

  ws.on('close', () => {
    const username = users[ws._socket._id];
    if (username) {
      broadcast({ type: 'message', sender: 'System', message: `${username} has left the chat.` });
      delete users[ws._socket._id];
    }
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
