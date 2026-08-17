import React from 'react';
import { Spinner } from './Spinner';
import { cn } from '../../lib/utils';

export interface LoaderProps {
  fullscreen?: boolean;
  message?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullscreen = false,
  message,
  className
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-4 p-6",
        fullscreen ? "fixed inset-0 z-50 bg-bgDark/90 backdrop-blur-md animate-in fade-in duration-200" : "w-full h-full min-h-[200px]",
        className
      )}
    >
      <Spinner size="lg" variant="primary" />
      {message && (
        <p className="text-sm font-medium text-primary animate-pulse tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};
