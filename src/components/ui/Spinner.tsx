import React from 'react';
import { cn } from '../../lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'light';
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'primary',
  ...props
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-4',
  };

  const variants = {
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-textMuted/20 border-t-textLight',
    light: 'border-white/20 border-t-white',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
