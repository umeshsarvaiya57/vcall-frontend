import { useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSessionStore } from '../store/sessionStore';
import { useMatchmakingStore } from '../store/matchmakingStore';
import { useCallStore } from '../store/callStore';

/**
 * Hook responsible for sending match/searching requests to the server,
 * handling state mutations for queues and call status values.
 */
export function useMatchmaking() {
  const { socket, isConnected } = useSocket();
  const sessionId = useSessionStore((state) => state.sessionId);
  const gender = useSessionStore((state) => state.gender);

  const isSearching = useMatchmakingStore((state) => state.isSearching);
  const setSearching = useMatchmakingStore((state) => state.setSearching);
  const setMatched = useMatchmakingStore((state) => state.setMatched);
  const setPartnerConnected = useMatchmakingStore((state) => state.setPartnerConnected);

  const setCallState = useCallStore((state) => state.setCallState);
  const setRoomId = useCallStore((state) => state.setRoomId);

  const startSearching = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (sessionId && gender) {
      // Connect socket and register anonymous identity
      socket.emit('SESSION_INIT', { sessionId, gender });
      socket.emit('JOIN_QUEUE');
      setSearching(true);
      setMatched(false);
      setPartnerConnected(false);
      setCallState('searching');
    }
  }, [socket, sessionId, gender, setSearching, setMatched, setPartnerConnected, setCallState]);

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
