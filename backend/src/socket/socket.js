import { Server } from "socket.io";
import Message from "../models/message.model.js";
let io;
// Map to track which socket ID belongs to which user ID
export const onlineUsers = new Map(); 

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // When a user logs in, they send their ID to register their socket
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });


    socket.on("send_message", async (data) => {
    try {
      const { sender_id, receiver_id, content } = data;

      // 1. Save to Database
      const newMessage = await Message.create({
        sender_id,
        receiver_id,
        content,
      });

      // 2. Broadcast to ALL connected clients
      // The frontend will automatically filter it so only the actual sender and receiver see it in their UI
      io.emit("receive_message", newMessage);

    } catch (error) {
      console.error("Socket send_message error:", error);
    }
  });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};