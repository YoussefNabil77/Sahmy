import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
      <input
        type="text"
        className="w-full ps-9 pe-3 py-2 text-sm rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        style={{ borderColor: 'rgb(var(--surface-border))', color: 'rgb(var(--text-primary))' }}
        {...props}
      />
    </div>
  );
}
