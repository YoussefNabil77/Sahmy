import React from 'react';
import { cn } from '../../lib/utils';

export function Button({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }) {
  const variants = {
    primary: 'btn-primary',
    outline: 'border border-[rgb(var(--surface-border))] hover:bg-emerald-500/5',
    ghost: 'hover:bg-emerald-500/10 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
  };
  return (
    <button className={cn('px-4 py-2 rounded-lg font-medium transition-colors', variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
