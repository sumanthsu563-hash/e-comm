import http from 'http';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io instance
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

import { setSocketIO } from './config/socket.js';

// after initializing io
setSocketIO(io);

server.listen(PORT, () => {
  console.log(
    `🚀 Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`
  );
  console.log(
    `📡 Health check available at http://localhost:${PORT}/api/health`
  );
});
