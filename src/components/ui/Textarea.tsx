import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-bgDark border border-borderDark px-3 py-2 text-sm text-textLight placeholder-textMuted transition-all duration-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none disabled:opacity-50 disabled:pointer-events-none",
          error && "border-danger focus:border-danger focus:ring-danger",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
