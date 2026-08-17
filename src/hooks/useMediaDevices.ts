import { useCallback, useState } from 'react';
import { useCallStore } from '../store/callStore';
import { VIDEO_CONSTRAINTS } from '../constants/app.constants';

/**
 * Hook responsible for checking media device availability, requesting permission,
 * and toggling track activation statuses.
 */
export function useMediaDevices() {
  const localStream = useCallStore((state) => state.localStream);
  const setLocalStream = useCallStore((state) => state.setLocalStream);
  const isCameraEnabled = useCallStore((state) => state.isCameraEnabled);
  const setCameraEnabled = useCallStore((state) => state.setCameraEnabled);
  const isMuted = useCallStore((state) => state.isMuted);
  const setMuted = useCallStore((state) => state.setMuted);

  const [permissionError, setPermissionError] = useState<string | null>(null);

  const requestMedia = useCallback(async () => {
    try {
      setPermissionError(null);
      // Re-use active stream if available
      if (localStream && localStream.active) {
        return localStream;
      }

      const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
      setLocalStream(stream);

      // Apply initial mute/toggle preferences to the new stream tracks
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraEnabled;
      });
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });

      return stream;
    } catch (error: any) {
      console.error('Error requesting media devices:', error);
      let errorMsg = 'Camera and microphone access are required to chat.';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMsg = 'Permission denied. Please enable camera and microphone access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera or microphone detected on your device.';
      }
      setPermissionError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [localStream, setLocalStream, isCameraEnabled, isMuted]);

  const toggleCamera = useCallback(() => {
    const nextVal = !isCameraEnabled;
    setCameraEnabled(nextVal);
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = nextVal;
      });
    }
  }, [isCameraEnabled, localStream, setCameraEnabled]);

  const toggleMicrophone = useCallback(() => {
    const nextMuted = !isMuted;
    setMuted(nextMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
  }, [isMuted, localStream, setMuted]);

  const stopMedia = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
  }, [localStream, setLocalStream]);

  return {
    localStream,
    isCameraEnabled,
    isMicrophoneEnabled: !isMuted,
    permissionError,
    requestMedia,
    toggleCamera,
    toggleMicrophone,
    stopMedia,
  };
}
