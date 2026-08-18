import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

/**
 * Socket.IO client singleton with strict event typing.
 * Automatically configured for WebSocket transport to avoid polling lag.
 */
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 60, // Keep trying for up to 60 seconds (useful for Render spin up delays)
  reconnectionDelay: 2000,
  transports: ['websocket'],
});
