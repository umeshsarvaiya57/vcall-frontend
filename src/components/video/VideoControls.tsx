import React, { useState } from 'react';
import { IconButton } from '../ui/IconButton';
import { Mic, MicOff, Camera, CameraOff, ArrowRight, ShieldAlert, MessageSquare } from 'lucide-react';
import { useCallStore } from '../../store/callStore';

interface VideoControlsProps {
  isMuted: boolean;
  isCameraEnabled: boolean;
  isChatOpen: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onNext: () => void;
  onOpenReport: () => void;
  onToggleChat: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isCameraEnabled,
  isChatOpen,
  onToggleMute,
  onToggleCamera,
  onNext,
  onOpenReport,
  onToggleChat,
}) => {
  const callState = useCallStore((state) => state.callState);

  const isSearching = callState === 'searching';
  const isConnecting = callState === 'connecting' || callState === 'matched';
  const [isNextLoading, setIsNextLoading] = useState(false);

  const handleNextClick = () => {
    if (isNextLoading || isSearching) return;
    setIsNextLoading(true);
    onNext();
    setTimeout(() => {
      setIsNextLoading(false);
    }, 1200); // 1.2s cooldown to prevent double clicks
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-4 md:p-6 bg-bgSurface/80 backdrop-blur-md border-t border-borderDark/40 shrink-0 z-10">
      {/* Mute Control */}
      <IconButton
        variant={isMuted ? 'danger' : 'secondary'}
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        disabled={isSearching}
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </IconButton>

      {/* Camera Toggle Control */}
      <IconButton
        variant={!isCameraEnabled ? 'danger' : 'secondary'}
        onClick={onToggleCamera}
        aria-label={isCameraEnabled ? "Disable camera" : "Enable camera"}
        disabled={isSearching}
      >
        {!isCameraEnabled ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
      </IconButton>

      {/* Next Match (Skip) Control */}
      <IconButton
        variant="primary"
        size="lg"
        onClick={handleNextClick}
        disabled={isSearching || isNextLoading}
        aria-label="Skip to next stranger"
        className="h-14 w-14 md:h-16 md:w-16 shadow-lg shadow-indigo-500/20 active:scale-95"
      >
        <ArrowRight className="h-6 w-6 text-textLight" />
      </IconButton>

      {/* Chat Sidebar Toggle Control */}
      <IconButton
        variant={isChatOpen ? 'primary' : 'secondary'}
        onClick={onToggleChat}
        aria-label={isChatOpen ? "Hide chat panel" : "Show chat panel"}
      >
        <MessageSquare className="h-5 w-5" />
      </IconButton>

      {/* Report Control */}
      <IconButton
        variant="danger"
        onClick={onOpenReport}
        disabled={isSearching || isConnecting}
        aria-label="Report partner"
      >
        <ShieldAlert className="h-5 w-5" />
      </IconButton>
    </div>
  );
};
