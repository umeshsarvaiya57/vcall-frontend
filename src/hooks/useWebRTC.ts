import { useCallback, useRef, useState } from 'react';
import { useCallStore } from '../store/callStore';
import { createPeerConnection } from '../lib/webrtc';
import { socket } from '../lib/socket';

/**
 * Hook managing the WebRTC PeerConnection lifecycle, including track binds,
 * offer/answer signaling relays, and remote stream mounts.
 */
export function useWebRTC() {
  const localStream = useCallStore((state) => state.localStream);
  const remoteStream = useCallStore((state) => state.remoteStream);
  const setRemoteStream = useCallStore((state) => state.setRemoteStream);
  const setCallState = useCallStore((state) => state.setCallState);
  const setConnectionStatusText = useCallStore((state) => state.setConnectionStatusText);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  const closeConnection = useCallback(() => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    setDataChannel(null);
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    setRemoteStream(null);
    setConnectionState('closed');
  }, [setRemoteStream]);

  const initPeerConnection = useCallback((room: string, customIceServers?: RTCIceServer[]) => {
    closeConnection();

    const pc = createPeerConnection(customIceServers);
    pcRef.current = pc;

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionState(state);

      const textMap: Record<RTCPeerConnectionState, string> = {
        new: 'Initializing...',
        connecting: 'Connecting...',
        connected: 'Connected',
        disconnected: 'Stranger disconnected',
        failed: 'Connection failed',
        closed: 'Connection closed',
      };
      setConnectionStatusText(textMap[state] || state);

      if (state === 'connected') {
        setCallState('connected');
      } else if (state === 'disconnected') {
        setCallState('disconnected');
      } else if (state === 'failed') {
        setCallState('error');
      }
    };

    // Attach local media tracks to connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    // Capture and emit ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && room) {
        socket.emit('WEBRTC_ICE_CANDIDATE', {
          candidate: event.candidate,
          roomId: room,
        });
      }
    };

    // Bind remote tracks to the incoming stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        const stream = new MediaStream();
        stream.addTrack(event.track);
        setRemoteStream(stream);
      }
    };

    return pc;
  }, [localStream, setRemoteStream, setCallState, setConnectionStatusText, closeConnection]);

  const createOffer = useCallback(async (room: string, customIceServers?: RTCIceServer[]) => {
    const pc = initPeerConnection(room, customIceServers);

    // Create peer-to-peer messaging channel
    const dc = pc.createDataChannel('chat', { ordered: true });
    dataChannelRef.current = dc;
    setDataChannel(dc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('WEBRTC_OFFER', { offer, roomId: room });
    return offer;
  }, [initPeerConnection]);

  const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit, room: string, customIceServers?: RTCIceServer[]) => {
    const pc = initPeerConnection(room, customIceServers);

    // Listen for data channel setups on responder side
    pc.ondatachannel = (event) => {
      dataChannelRef.current = event.channel;
      setDataChannel(event.channel);
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit('WEBRTC_ANSWER', { answer, roomId: room });
    return answer;
  }, [initPeerConnection]);

  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (pcRef.current) {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    if (pcRef.current) {
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  return {
    pcRef,
    dataChannelRef,
    dataChannel,
    localStream,
    remoteStream,
    connectionState,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    closeConnection,
  };
}
