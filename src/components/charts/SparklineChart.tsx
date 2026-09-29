import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';

export function SparklineChart({ data, color }: { data: number[], color: string }) {
  const chartData = data.map((val, i) => ({ val, i }));
  const min = Math.min(...data);
  const max = Math.max(...data);
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={[min, max]} hide />
          <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
