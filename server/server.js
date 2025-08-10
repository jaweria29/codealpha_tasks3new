const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Send a test task immediately
  socket.emit("new-task", {
    id: 1,
    title: "Design Homepage",
    assignedTo: "Fatima",
    status: "To-Do"
  });

  // Receive new task from any client and send to all clients
  socket.on("create-task", (task) => {
    console.log("📥 Task received from client:", task);
    io.emit("new-task", task);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
