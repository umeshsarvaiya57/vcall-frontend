import React, { useEffect, useRef } from 'react';
import { useCallStore } from '../../store/callStore';
import { User, ShieldAlert } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

export const RemoteVideo: React.FC = () => {
  const remoteStream = useCallStore((state) => state.remoteStream);
  const callState = useCallStore((state) => state.callState);
  const connectionStatusText = useCallStore((state) => state.connectionStatusText);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const isLoading = callState === 'matched' || callState === 'connecting';
  const isFailed = callState === 'error';
  const isSearching = callState === 'searching';
  const isReady = callState === 'ready' || callState === 'idle';

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center">
      {remoteStream && callState === 'connected' ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 p-6 text-center">
          {isSearching ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <Spinner size="lg" variant="primary" />
              </div>
              <p className="text-sm font-medium text-primary animate-pulse tracking-wide">
                Searching for a partner...
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" variant="primary" />
              <p className="text-sm font-medium text-textLight">
                {connectionStatusText}...
              </p>
            </div>
          ) : isFailed ? (
            <div className="flex flex-col items-center space-y-2 text-danger">
              <ShieldAlert className="h-12 w-12 mb-2" />
              <h5 className="font-semibold">Connection Failed</h5>
              <p className="text-xs text-textMuted max-w-xs">
                Could not establish WebRTC tunnel. Click "Next" to find a new match.
              </p>
            </div>
          ) : isReady ? (
            <div className="flex flex-col items-center space-y-2 text-textMuted">
              <User className="h-16 w-16 opacity-30" />
              <p className="text-sm font-medium">Ready to start chat</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 text-textMuted">
              <User className="h-16 w-16 opacity-30 animate-pulse" />
              <p className="text-sm font-medium">{connectionStatusText}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Label Overlay */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold text-textLight border border-white/10">
        Stranger
      </div>
    </div>
  );
};
