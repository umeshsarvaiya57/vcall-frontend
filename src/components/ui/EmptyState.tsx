import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-borderDark/40 bg-bgSurface/40 max-w-sm mx-auto",
        className
      )}
    >
      {Icon && (
        <div className="p-3 bg-bgSurfaceHover rounded-full border border-borderDark/60 mb-4">
          <Icon className="h-6 w-6 text-textMuted" />
        </div>
      )}
      <h4 className="text-base font-semibold text-textLight">{title}</h4>
      {description && (
        <p className="text-sm text-textMuted mt-1 mb-4 max-w-[280px]">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
