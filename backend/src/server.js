import http from 'http';
import app from './app.js';
import { connectDB } from './config/database.js';
import { initSocket } from './socket/socket.js'; // ADD THIS IMPORT

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
initSocket(server); 

await connectDB();
  
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});