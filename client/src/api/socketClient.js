import { io } from 'socket.io-client';

// Use the Vite proxy locally; set VITE_SOCKET_URL for a separately hosted API.
const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
  withCredentials: true,
  transports: ['websocket']
});

export default socket;
