import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide border transition-all duration-200';

  const variants = {
    primary: 'bg-primary/10 border-primary/20 text-indigo-400',
    secondary: 'bg-bgSurfaceHover border-borderDark text-textLight',
    success: 'bg-success/10 border-success/20 text-emerald-400',
    warning: 'bg-warning/10 border-warning/20 text-amber-400',
    danger: 'bg-danger/10 border-danger/20 text-red-400',
    outline: 'text-textLight border-borderDark bg-transparent',
  };

  return <span className={cn(baseStyles, variants[variant], className)} {...props} />;
};
