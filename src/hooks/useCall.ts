import { useEffect, useRef, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useMediaDevices } from './useMediaDevices';
import { useWebRTC } from './useWebRTC';
import { useMatchmaking } from './useMatchmaking';
import { useCallStore } from '../store/callStore';
import { useMatchmakingStore } from '../store/matchmakingStore';
import { useChatStore } from '../store/chatStore';
import { useToast } from './useToast';
import { MATCH_TIMEOUT } from '../constants/app.constants';

/**
 * Main coordinator hook that bridges browser media devices, WebRTC connections,
 * Socket messaging channels, and matchmaking queues.
 */
export function useCall() {
  const { socket, isConnected } = useSocket();
  const toast = useToast();
  const clearMessages = useChatStore((state) => state.clearMessages);

  const media = useMediaDevices();
  const webrtc = useWebRTC();
  const matchmaking = useMatchmaking();

  const callState = useCallStore((state) => state.callState);
  const setCallState = useCallStore((state) => state.setCallState);
  const roomId = useCallStore((state) => state.roomId);
  const setRoomId = useCallStore((state) => state.setRoomId);

  const setMatched = useMatchmakingStore((state) => state.setMatched);
  const setPartnerConnected = useMatchmakingStore((state) => state.setPartnerConnected);

  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const endCall = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    webrtc.closeConnection();
    matchmaking.leaveRoom();
    clearMessages();
    setCallState('ready');
  }, [webrtc, matchmaking, clearMessages, setCallState]);

  const nextCall = useCallback(async () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    webrtc.closeConnection();
    clearMessages();

    // Notify server of skip and jump directly back into matchmaking queue
    socket.emit('NEXT_MATCH');
    setCallState('searching');
    setMatched(false);
    setPartnerConnected(false);
  }, [webrtc, clearMessages, socket, setCallState, setMatched, setPartnerConnected]);

  const reportUser = useCallback((reason: string, description?: string) => {
    if (!roomId) return;
    socket.emit('REPORT_USER', {
      reportedSessionId: '', // Server identifies target from current active room
      roomId,
      reason,
      description,
    });
    toast.success('Stranger reported. Match terminated.');
    nextCall();
  }, [roomId, socket, toast, nextCall]);

  useEffect(() => {
    if (!isConnected) return;

    const handleMatchFound = async (data: { roomId: string; isInitiator: boolean; partnerSessionId: string }) => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      setRoomId(data.roomId);
      setCallState('connecting');
      setMatched(true);
      setPartnerConnected(true);

      // Start watchdog to reset if connection stalls
      connectionTimeoutRef.current = setTimeout(() => {
        if (useCallStore.getState().callState !== 'connected') {
          toast.info('Connection timed out. Finding a new partner...');
          nextCall();
        }
      }, MATCH_TIMEOUT);

      if (data.isInitiator) {
        try {
          // Delay offer slightly to allow partner to register handlers
          setTimeout(async () => {
            await webrtc.createOffer(data.roomId);
          }, 600);
        } catch (err) {
          console.error('Failed to create offer:', err);
        }
      }
    };

    const handleOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
      const activeRoom = useCallStore.getState().roomId;
      if (activeRoom) {
        try {
          await webrtc.handleOffer(data.offer, activeRoom);
        } catch (err) {
          console.error('Failed to process offer:', err);
        }
      }
    };

    const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
      try {
        await webrtc.handleAnswer(data.answer);
      } catch (err) {
        console.error('Failed to process answer:', err);
      }
    };

    const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
      try {
        await webrtc.handleIceCandidate(data.candidate);
      } catch (err) {
        console.error('Failed to add candidate:', err);
      }
    };

    const handlePeerDisconnected = () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      webrtc.closeConnection();
      setPartnerConnected(false);
      setCallState('disconnected');
      toast.info('Stranger disconnected.');
    };

    const handleCallEnded = (data: { reason?: string }) => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      webrtc.closeConnection();
      setPartnerConnected(false);
      setCallState('ended');
      toast.info(data.reason || 'Call terminated.');
    };

    const handleError = (err: { message: string }) => {
      toast.error(err.message);
    };

    socket.on('MATCH_FOUND', handleMatchFound);
    socket.on('WEBRTC_OFFER', handleOffer);
    socket.on('WEBRTC_ANSWER', handleAnswer);
    socket.on('WEBRTC_ICE_CANDIDATE', handleIceCandidate);
    socket.on('PEER_DISCONNECTED', handlePeerDisconnected);
    socket.on('CALL_ENDED', handleCallEnded);
    socket.on('ERROR', handleError);

    return () => {
      socket.off('MATCH_FOUND', handleMatchFound);
      socket.off('WEBRTC_OFFER', handleOffer);
      socket.off('WEBRTC_ANSWER', handleAnswer);
      socket.off('WEBRTC_ICE_CANDIDATE', handleIceCandidate);
      socket.off('PEER_DISCONNECTED', handlePeerDisconnected);
      socket.off('CALL_ENDED', handleCallEnded);
      socket.off('ERROR', handleError);
    };
  }, [socket, isConnected, webrtc, setCallState, setRoomId, setMatched, setPartnerConnected, nextCall, toast]);

  // Cancel match timeouts once WebRTC transitions to connected state
  useEffect(() => {
    if (callState === 'connected' && connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, [callState]);

  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...media,
    ...webrtc,
    ...matchmaking,
    callState,
    roomId,
    endCall,
    nextCall,
    reportUser,
  };
}
