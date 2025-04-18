const dns = require('dns');
const express = require('express');
const path = require('path');

// Set custom DNS servers
dns.setServers(['8.8.8.8', '1.0.0.1']);

const app = express();

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://10.11.128.1:${PORT}`);
    console.log(`Using DNS servers: ${dns.getServers().join(', ')}`);
});
