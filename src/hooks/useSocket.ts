import { useEffect, useState, useCallback } from 'react';
import { socket } from '../lib/socket';

/**
 * Custom hook to interface with the global Socket.IO connection.
 * Synchronizes the socket's connection state with React.
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      const sessId = sessionStorage.getItem('sessionId');
      const gndr = sessionStorage.getItem('gender');
      if (sessId && gndr) {
        socket.emit('SESSION_INIT', { sessionId: sessId, gender: gndr as 'male' | 'female' });
      }
    };
    const handleDisconnect = () => setIsConnected(false);
    const handleConnectError = (err: any) => {
      console.error('Socket connection error:', err.message, err.description);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Initial state check
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, []);

  const connect = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  }, []);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
  };
}
