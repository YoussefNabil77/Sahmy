import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../hooks/useStockData';
import { GrowthChart } from '../charts/GrowthChart';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

export function GrowthSection({ ticker }: { ticker: string }) {
  const [type, setType] = useState<'annual' | 'quarterly'>('annual');
  const { data, isLoading } = useFinancials(ticker, type);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold">الأداء المالي</h3>
          {data?.[0]?.isMock && <Badge variant="mock">بيانات تجريبية</Badge>}
        </div>
        <div className="flex bg-[rgb(var(--surface-bg))] rounded-lg p-1">
          <button
            onClick={() => setType('annual')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${type === 'annual' ? 'bg-[rgb(var(--surface-card))] shadow' : 'text-[rgb(var(--text-secondary))]'}`}
          >
            سنوي
          </button>
          <button
            onClick={() => setType('quarterly')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${type === 'quarterly' ? 'bg-[rgb(var(--surface-card))] shadow' : 'text-[rgb(var(--text-secondary))]'}`}
          >
            ربع سنوي
          </button>
        </div>
      </div>
      {isLoading ? <Skeleton className="h-72 w-full" /> : data ? <GrowthChart data={data} /> : null}
    </Card>
  );
}
