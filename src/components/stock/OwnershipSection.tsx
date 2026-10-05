import React from 'react';
import { Card } from '../ui/Card';
import { useOwnership } from '../../hooks/useStockData';
import { OwnershipDonut } from '../charts/OwnershipDonut';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

export function OwnershipSection({ ticker }: { ticker: string }) {
  const { data, isLoading } = useOwnership(ticker);

  if (isLoading) return <Skeleton className="h-80 w-full" />;
  if (!data || data.length === 0) return null;

  return (
    <Card glass>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">هيكل الملكية</h3>
        {data[0]?.isMock && <Badge variant="mock">بيانات تجريبية</Badge>}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full">
          <OwnershipDonut data={data} />
        </div>
        <div className="flex-1 w-full space-y-4">
          {data.map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(var(--surface-bg))]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="font-bold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
