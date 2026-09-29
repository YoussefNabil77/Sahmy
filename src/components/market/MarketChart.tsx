import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useIndexHistory } from '../../hooks/useMarketData';
import { IndexChart } from '../charts/IndexChart';
import { Skeleton } from '../ui/Skeleton';

const RANGES = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];

export function MarketChart() {
  const [range, setRange] = useState('1M');
  const { data, isLoading } = useIndexHistory(range);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">أداء EGX30</h3>
        <div className="flex bg-[rgb(var(--surface-bg))] rounded-lg p-1">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                range === r 
                  ? 'bg-[rgb(var(--surface-card))] shadow text-[rgb(var(--text-primary))]' 
                  : 'text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? <Skeleton className="h-72 w-full" /> : data ? <IndexChart data={data} /> : null}
    </Card>
  );
}
