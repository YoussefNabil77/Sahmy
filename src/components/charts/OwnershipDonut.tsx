import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { OwnershipItem } from '../../types';

export function OwnershipDonut({ data }: { data: OwnershipItem[] }) {
  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="percentage"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))', borderRadius: '0.5rem', direction: 'rtl' }}
            formatter={(value: number) => [`${value}%`, 'النسبة']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg font-bold" style={{ color: 'rgb(var(--text-primary))' }}>هيكل الملكية</span>
      </div>
    </div>
  );
}
