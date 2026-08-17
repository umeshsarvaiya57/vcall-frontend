import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-success" />,
    error: <AlertCircle className="h-5 w-5 text-danger" />,
    info: <Info className="h-5 w-5 text-primary" />,
  };

  const borders = {
    success: 'border-success/30 bg-emerald-950/50 text-emerald-100',
    error: 'border-danger/30 bg-red-950/50 text-red-100',
    info: 'border-primary/30 bg-indigo-950/50 text-indigo-100',
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-xl border glass-panel shadow-xl max-w-sm w-full animate-in slide-in-from-right-5 fade-in duration-300 pointer-events-auto",
        borders[type]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium leading-5">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-textMuted hover:text-textLight transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
