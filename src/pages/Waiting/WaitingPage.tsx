import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaDevices } from '../../hooks/useMediaDevices';
import { Button } from '../../components/ui/Button';
import { Camera, CameraOff, Mic, MicOff, AlertTriangle, ArrowLeft } from 'lucide-react';

export const WaitingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    localStream,
    isCameraEnabled,
    isMicrophoneEnabled,
    permissionError,
    requestMedia,
    toggleCamera,
    toggleMicrophone,
    stopMedia,
  } = useMediaDevices();

  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;
    const initMedia = async () => {
      setIsLoading(true);
      try {
        await requestMedia();
      } catch (err) {
        console.error('Failed to init media preview:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    initMedia();

    return () => {
      active = false;
    };
  }, [requestMedia]);

  useEffect(() => {
    if (videoRef.current && localStream && isCameraEnabled) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, isCameraEnabled]);

  const handleStartSearch = () => {
    navigate('/chat');
  };

  const handleRetryPermissions = async () => {
    setIsLoading(true);
    try {
      await requestMedia();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgDark px-6 py-8">
      {/* Header Back Button */}
      <header className="max-w-xl w-full mx-auto flex items-center">
        <button
          onClick={() => {
            stopMedia();
            navigate('/gender');
          }}
          className="flex items-center text-sm text-textMuted hover:text-textLight transition-colors gap-1.5 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Preview */}
      <main className="max-w-md w-full mx-auto flex flex-col items-center my-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-glow tracking-tight text-center">
          Camera Preview
        </h2>
        <p className="text-sm text-textMuted mt-2 text-center max-w-xs leading-relaxed">
          Configure your devices before entering matchmaking.
        </p>

        {/* Video Box */}
        <div className="w-full aspect-video md:aspect-square md:max-h-[320px] rounded-2xl overflow-hidden bg-slate-950 border border-borderDark/80 relative mt-8 shadow-2xl">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-900/50">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary" />
              <span className="text-xs text-textMuted">Accessing camera...</span>
            </div>
          ) : permissionError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-danger space-y-4">
              <AlertTriangle className="h-10 w-10 text-danger/80 animate-pulse" />
              <h5 className="font-semibold text-sm">Media Access Required</h5>
              <p className="text-xs text-textMuted max-w-[280px]">
                {permissionError}
              </p>
              <Button variant="outline" size="sm" onClick={handleRetryPermissions}>
                Try Again
              </Button>
            </div>
          ) : isCameraEnabled && localStream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-textMuted">
              <CameraOff className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-xs">Camera is turned off</span>
            </div>
          )}
        </div>

        {/* Quick Toggles */}
        <div className="flex gap-4 w-full justify-center mt-6">
          <Button
            variant={isCameraEnabled ? 'secondary' : 'danger'}
            size="md"
            className="flex-1 max-w-[150px] gap-2 border border-borderDark"
            onClick={toggleCamera}
            disabled={!!permissionError || isLoading}
          >
            {isCameraEnabled ? (
              <>
                <Camera className="h-4 w-4 text-primary" />
                <span>Camera ON</span>
              </>
            ) : (
              <>
                <CameraOff className="h-4 w-4" />
                <span>Camera OFF</span>
              </>
            )}
          </Button>

          <Button
            variant={isMicrophoneEnabled ? 'secondary' : 'danger'}
            size="md"
            className="flex-1 max-w-[150px] gap-2 border border-borderDark"
            onClick={toggleMicrophone}
            disabled={!!permissionError || isLoading}
          >
            {isMicrophoneEnabled ? (
              <>
                <Mic className="h-4 w-4 text-primary" />
                <span>Mic ON</span>
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4" />
                <span>Mic OFF</span>
              </>
            )}
          </Button>
        </div>

        {/* Start Action */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading || !!permissionError}
          className="mt-8 font-semibold tracking-wide"
          onClick={handleStartSearch}
        >
          Start Searching
        </Button>
      </main>

      <footer className="text-center text-xs text-textMuted max-w-sm w-full mx-auto">
        Please follow our community guidelines. Recording or capturing call data is strictly prohibited.
      </footer>
    </div>
  );
};
