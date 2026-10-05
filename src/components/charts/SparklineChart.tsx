import React from 'react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

export function SparklineChart({ data, color }: { data: number[], color: string }) {
  if (!data || data.length === 0) return <div className="h-12 w-24 bg-slate-50/50 rounded-lg animate-pulse" />;
  
  const chartData = data.map((val, i) => ({ val, i }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  const id = `gradient-${Math.random().toString(36).substring(7)}`;

  return (
    <div className="h-12 w-24 opacity-80 group-hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis domain={[min, max]} hide />
          <Area 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            fillOpacity={1} 
            fill={`url(#${id})`} 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
