import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart } from 'recharts';
import type { PricePoint } from '../../types';
import { formatNumber } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

export function StockPriceChart({ data }: { data: PricePoint[] }) {
  const { theme } = useTheme();
  const color = 'rgb(var(--accent))';
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => new Date(val).toLocaleDateString('ar-EG', { month: 'short' })} 
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right"
            tickFormatter={(val) => formatNumber(val)}
            stroke={theme === 'dark' ? '#475569' : '#94a3b8'}
            tick={{ fontSize: 12, fill: theme === 'dark' ? '#94a3b8' : '#475569' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))', borderRadius: '0.5rem', direction: 'rtl' }}
            itemStyle={{ color: 'rgb(var(--text-primary))' }}
            formatter={(value: number, name: string) => [formatNumber(value), name === 'price' ? 'السعر' : name === 'ma50' ? 'متوسط 50 يوم' : 'متوسط 200 يوم']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('ar-EG')}
          />
          <Area type="monotone" dataKey="price" stroke={color} fillOpacity={1} fill="url(#stockColor)" />
          {data[0]?.ma50 !== undefined && <Line type="monotone" dataKey="ma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} />}
          {data[0]?.ma200 !== undefined && <Line type="monotone" dataKey="ma200" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
