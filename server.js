const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Serve static files from the public directory with cache control for Replit
app.use(express.static('public', {
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-cache');
  }
}));

// API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

// Serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
