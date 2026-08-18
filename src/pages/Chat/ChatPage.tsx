import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../../hooks/useCall';
import { CallHeader } from '../../components/video/CallHeader';
import { RemoteVideo } from '../../components/video/RemoteVideo';
import { LocalVideo } from '../../components/video/LocalVideo';
import { VideoControls } from '../../components/video/VideoControls';
import { ChatBox } from '../../components/chat/ChatBox';
import { ReportModal } from '../../components/report/ReportModal';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  const {
    isMuted,
    isCameraEnabled,
    dataChannel,
    startSearching,
    endCall,
    nextCall,
    toggleCamera,
    toggleMicrophone,
    reportUser,
  } = useCall();

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Set chat panel visibility by default depending on viewport size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsChatOpen(false);
      } else {
        setIsChatOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initiate search immediately on mount and clear everything on page leave
  useEffect(() => {
    startSearching();
    return () => {
      endCall();
    };
  }, [startSearching, endCall]);

  const handleExitCall = () => {
    endCall();
    navigate('/waiting');
  };

  const handleReportSubmit = (reason: string, description: string) => {
    reportUser(reason, description);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bgDark text-textLight overflow-hidden h-screen max-h-screen">
      {/* Offline Status Warning */}
      {!isOnline && (
        <div className="bg-danger text-textLight text-xs py-1.5 text-center font-semibold tracking-wide animate-pulse">
          No Connection - Matchmaking will resume when internet is active.
        </div>
      )}

      {/* Header bar */}
      <CallHeader onEndCall={handleExitCall} />

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0 relative p-4 gap-4 overflow-hidden flex-col md:flex-row">
        {/* Remote & Local Streams Area */}
        <div className="flex-1 min-h-0 relative flex rounded-2xl overflow-hidden shadow-2xl">
          <RemoteVideo />
          
          {/* Floating PIP Local Preview */}
          <div className="absolute bottom-4 right-4 w-28 md:w-40 aspect-video md:aspect-square md:max-h-[140px] z-10 transition-all">
            <LocalVideo />
          </div>
        </div>

        {/* Text chat sidebar panel */}
        {isChatOpen && (
          <div className="w-full md:w-[350px] lg:w-[380px] shrink-0 min-h-0 h-[40%] md:h-full z-10 transition-all duration-300">
            <ChatBox dataChannel={dataChannel} />
          </div>
        )}
      </div>

      {/* Bottom control switches */}
      <VideoControls
        isMuted={isMuted}
        isCameraEnabled={isCameraEnabled}
        isChatOpen={isChatOpen}
        onToggleMute={toggleMicrophone}
        onToggleCamera={toggleCamera}
        onNext={nextCall}
        onOpenReport={() => setIsReportOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      {/* Report Modal Popup */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};
