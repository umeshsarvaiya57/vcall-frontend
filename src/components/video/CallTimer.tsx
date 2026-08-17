import React, { useEffect, useState } from 'react';
import { useCallStore } from '../../store/callStore';
import { formatTime } from '../../lib/utils';
import { Timer } from 'lucide-react';

export const CallTimer: React.FC = () => {
  const callState = useCallStore((state) => state.callState);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (callState !== 'connected') {
      setSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callState]);

  if (callState !== 'connected') return null;

  return (
    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-borderDark/40 text-xs font-mono text-textMuted select-none">
      <Timer className="h-3.5 w-3.5 text-primary animate-pulse" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
};
