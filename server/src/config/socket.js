// src/config/socket.js
// Simple holder for the Socket.io instance to avoid circular imports.
let io = null;

export const setSocketIO = (socketIO) => {
  io = socketIO;
};

export const getSocketIO = () => io;
