import React from 'react';
import { Video, LogOut } from 'lucide-react';
import { APP_NAME } from '../../constants/app.constants';
import { useCallStore } from '../../store/callStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CallTimer } from './CallTimer';

interface CallHeaderProps {
  onEndCall: () => void;
}

export const CallHeader: React.FC<CallHeaderProps> = ({ onEndCall }) => {
  const callState = useCallStore((state) => state.callState);

  const getStatusBadge = () => {
    switch (callState) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'searching':
        return <Badge variant="primary" className="animate-pulse">Searching</Badge>;
      case 'connecting':
        return <Badge variant="warning" className="animate-pulse">Connecting</Badge>;
      case 'error':
        return <Badge variant="danger">Error</Badge>;
      default:
        return <Badge variant="secondary">Ready</Badge>;
    }
  };

  return (
    <header className="px-6 py-3 border-b border-borderDark/40 bg-bgSurface/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onEndCall}>
          <div className="p-1.5 bg-primary/25 rounded-lg text-primary border border-primary/30">
            <Video className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-textLight select-none">{APP_NAME}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center space-x-3">
        <CallTimer />
        <Button
          variant="secondary"
          size="sm"
          onClick={onEndCall}
          className="gap-1.5 text-xs font-semibold px-3 py-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit</span>
        </Button>
      </div>
    </header>
  );
};
