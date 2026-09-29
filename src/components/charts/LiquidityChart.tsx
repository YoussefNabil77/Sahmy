import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { LiquidityDay } from '../../types';
import { formatCompact } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

export function LiquidityChart({ data }: { data: LiquidityDay[] }) {
  const { theme } = useTheme();
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => new Date(val).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} 
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <YAxis 
            orientation="right"
            tickFormatter={(val) => formatCompact(val)}
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))', borderRadius: '0.5rem', direction: 'rtl' }}
            formatter={(value: number, name: string) => [formatCompact(value), name === 'buyValue' ? 'قيمة الشراء' : 'قيمة البيع']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('ar-EG')}
          />
          <Bar dataKey="buyValue" fill="#10b981" stackId="a" />
          <Bar dataKey="sellValue" fill="#ef4444" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
