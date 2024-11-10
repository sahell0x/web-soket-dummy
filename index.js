const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require("cors");
const app = express();
const server = http.createServer(app);

// CORS middleware to allow any origin
app.use(cors());

// Create a WebSocket server using the same HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection logic
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a message periodically to the client
  const interval = setInterval(() => {
    ws.send('Hello from server!');
  }, 1000);

  // Simulate random disconnect every few seconds
  const disconnectInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      console.log('Random disconnection');
      ws.close(); // Close the WebSocket connection
      clearInterval(interval); // Clear the message interval
    }
  }, 5000);

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Echo: ' + message); // Send the message back to the client
  });

  // Cleanup on disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(disconnectInterval);
  });
});

// Start the server on a dynamic port (for platforms like Railway or Heroku)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
