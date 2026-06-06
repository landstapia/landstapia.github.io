const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(express.static(__dirname));

const server = http.createServer(app);

// Attach WebSocket server to HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {

    let lyrics = JSON.parse(message.toString());

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(lyrics));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(80, () => {
  console.log("Server running at http://localhost");
});