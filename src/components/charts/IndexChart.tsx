import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { IndexHistoryPoint } from '../../types';
import { formatNumber } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

export function IndexChart({ data }: { data: IndexHistoryPoint[] }) {
  const { theme } = useTheme();
  const color = 'rgb(var(--accent))';
  
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => new Date(val).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })} 
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            tickFormatter={(val) => formatNumber(val, 0)}
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))', borderRadius: '0.5rem', direction: 'rtl' }}
            itemStyle={{ color: 'rgb(var(--text-primary))' }}
            formatter={(value: number) => [formatNumber(value), 'القيمة']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('ar-EG')}
          />
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
