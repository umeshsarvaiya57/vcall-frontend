import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-full h-full rounded-none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content wrapper */}
      <div
        className={cn(
          "relative w-full rounded-2xl glass-panel text-textLight shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95",
          sizes[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-borderDark/40">
            {title ? (
              <h3 className="text-lg font-semibold tracking-wide text-textLight">{title}</h3>
            ) : (
              <div />
            )}
            {onClose && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-textMuted hover:text-textLight" />
              </IconButton>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
