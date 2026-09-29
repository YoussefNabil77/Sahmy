import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'mock' | 'up' | 'down' }) {
  const variants = {
    default: 'bg-emerald-500/10 text-emerald-500',
    mock: 'badge-mock',
    up: 'bg-emerald-500/10 text-emerald-500',
    down: 'bg-red-500/10 text-red-500'
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
