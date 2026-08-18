import { useCallback, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useMatchmakingStore } from '../store/matchmakingStore';
import { useCallStore } from '../store/callStore';

/**
 * Hook responsible for sending match/searching requests to the server,
 * handling state mutations for queues and call status values.
 */
export function useMatchmaking() {
  const { socket } = useSocket();


  const isSearching = useMatchmakingStore((state) => state.isSearching);
  const setSearching = useMatchmakingStore((state) => state.setSearching);
  const setMatched = useMatchmakingStore((state) => state.setMatched);
  const setPartnerConnected = useMatchmakingStore((state) => state.setPartnerConnected);

  const setCallState = useCallStore((state) => state.setCallState);
  const setRoomId = useCallStore((state) => state.setRoomId);

  useEffect(() => {
    const handleSessionReady = () => {
      // If the client's intent is to search, join queue when session is ready on the server
      if (useMatchmakingStore.getState().isSearching) {
        socket.emit('JOIN_QUEUE');
      }
    };

    socket.on('SESSION_READY', handleSessionReady);
    return () => {
      socket.off('SESSION_READY', handleSessionReady);
    };
  }, [socket]);

  const startSearching = useCallback(() => {
    setSearching(true);
    setMatched(false);
    setPartnerConnected(false);
    setCallState('searching');

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit('JOIN_QUEUE');
    }
  }, [socket, setSearching, setMatched, setPartnerConnected, setCallState]);

  const stopSearching = useCallback(() => {
    socket.emit('LEAVE_QUEUE');
    setSearching(false);
    setMatched(false);
    setPartnerConnected(false);
    setCallState('ready');
  }, [socket, setSearching, setMatched, setPartnerConnected, setCallState]);

  const leaveRoom = useCallback(() => {
    socket.emit('LEAVE_ROOM');
    setSearching(false);
    setMatched(false);
    setPartnerConnected(false);
    setRoomId(null);
    setCallState('ready');
  }, [socket, setSearching, setMatched, setPartnerConnected, setRoomId, setCallState]);

  return {
    isSearching,
    startSearching,
    stopSearching,
    leaveRoom,
  };
}
