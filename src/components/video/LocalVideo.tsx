import React, { useEffect, useRef } from 'react';
import { useCallStore } from '../../store/callStore';
import { CameraOff } from 'lucide-react';

export const LocalVideo: React.FC = () => {
  const localStream = useCallStore((state) => state.localStream);
  const isCameraEnabled = useCallStore((state) => state.isCameraEnabled);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-lg aspect-video md:aspect-auto">
      {isCameraEnabled && localStream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover scale-x-[-1]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-textMuted">
          <CameraOff className="h-8 w-8 mb-2" />
          <span className="text-xs">Camera Off</span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-xs text-textLight">
        You
      </div>
    </div>
  );
};
