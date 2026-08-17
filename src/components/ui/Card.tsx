import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  hoverable = false,
  children,
  ...props
}) => {
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-300';

  const variants = {
    default: 'bg-bgSurface border border-borderDark/60',
    glass: 'glass-card',
    outline: 'border border-borderDark bg-transparent',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverable && 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
