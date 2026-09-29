import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, glass = false }: { children: React.ReactNode, className?: string, glass?: boolean }) {
  return (
    <div className={cn(glass ? 'card-glass' : 'card', className)}>
      {children}
    </div>
  );
}
