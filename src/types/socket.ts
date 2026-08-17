export interface ClientToServerEvents {
  SESSION_INIT: (data: { sessionId: string; gender: 'male' | 'female' }) => void;
  JOIN_QUEUE: () => void;
  LEAVE_QUEUE: () => void;
  NEXT_MATCH: () => void;
  LEAVE_ROOM: () => void;
  WEBRTC_OFFER: (data: { offer: RTCSessionDescriptionInit; roomId: string }) => void;
  WEBRTC_ANSWER: (data: { answer: RTCSessionDescriptionInit; roomId: string }) => void;
  WEBRTC_ICE_CANDIDATE: (data: { candidate: RTCIceCandidateInit; roomId: string }) => void;
  CHAT_MESSAGE: (data: { message: string; roomId: string }) => void;
  REPORT_USER: (data: {
    reportedSessionId: string;
    roomId: string;
    reason: string;
    description?: string;
  }) => void;
  PING: () => void;
}

export interface ServerToClientEvents {
  SESSION_READY: (data: { sessionId: string }) => void;
  QUEUE_JOINED: () => void;
  MATCH_WAITING: () => void;
  MATCH_FOUND: (data: {
    roomId: string;
    isInitiator: boolean;
    partnerSessionId: string;
  }) => void;
  WEBRTC_OFFER: (data: { offer: RTCSessionDescriptionInit }) => void;
  WEBRTC_ANSWER: (data: { answer: RTCSessionDescriptionInit }) => void;
  WEBRTC_ICE_CANDIDATE: (data: { candidate: RTCIceCandidateInit }) => void;
  PEER_CONNECTED: () => void;
  PEER_DISCONNECTED: () => void;
  CHAT_MESSAGE: (data: { text: string }) => void;
  CALL_ENDED: (data: { reason?: string }) => void;
  REPORT_SUBMITTED: (data: { success: boolean }) => void;
  ERROR: (data: { message: string; code?: string }) => void;
}
