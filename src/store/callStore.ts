import { create } from 'zustand';

export type CallState =
  | 'idle'
  | 'requesting_media'
  | 'ready'
  | 'searching'
  | 'matched'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'ended'
  | 'error';

interface CallStateProps {
  callState: CallState;
  connectionStatusText: string;
  isMuted: boolean;
  isCameraEnabled: boolean;
  roomId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setCallState: (callState: CallState) => void;
  setConnectionStatusText: (text: string) => void;
  setRoomId: (roomId: string | null) => void;
  setMuted: (isMuted: boolean) => void;
  setCameraEnabled: (isEnabled: boolean) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  resetCall: () => void;
}

export const useCallStore = create<CallStateProps>((set) => ({
  callState: 'idle',
  connectionStatusText: 'Ready',
  isMuted: false,
  isCameraEnabled: true,
  roomId: null,
  localStream: null,
  remoteStream: null,

  setCallState: (callState) => set({ callState }),
  setConnectionStatusText: (connectionStatusText) => set({ connectionStatusText }),
  setRoomId: (roomId) => set({ roomId }),
  setMuted: (isMuted) => set({ isMuted }),
  setCameraEnabled: (isCameraEnabled) => set({ isCameraEnabled }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleCamera: () => set((state) => ({ isCameraEnabled: !state.isCameraEnabled })),
  setLocalStream: (localStream) => set({ localStream }),
  setRemoteStream: (remoteStream) => set({ remoteStream }),
  resetCall: () => set((state) => {
    // Stop remote stream if active
    if (state.remoteStream) {
      state.remoteStream.getTracks().forEach((track) => track.stop());
    }
    return {
      callState: 'ready',
      connectionStatusText: 'Ready',
      roomId: null,
      remoteStream: null,
    };
  }),
}));
