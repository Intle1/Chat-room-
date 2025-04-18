const express = require('express');
const path = require('path');

const app = express();

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
