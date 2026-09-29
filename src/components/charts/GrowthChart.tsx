import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { FinancialPeriod } from '../../types';
import { formatCompact } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

export function GrowthChart({ data }: { data: FinancialPeriod[] }) {
  const { theme } = useTheme();
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
          <XAxis 
            dataKey="period" 
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
            formatter={(value: number, name: string) => [formatCompact(value), name === 'revenue' ? 'الإيرادات' : 'صافي الربح']}
          />
          <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
          <Bar dataKey="netProfit" fill="#10b981" name="netProfit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
