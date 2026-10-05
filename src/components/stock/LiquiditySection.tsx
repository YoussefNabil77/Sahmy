import React from 'react';
import { Card } from '../ui/Card';
import { useLiquidity } from '../../hooks/useStockData';
import { LiquidityChart } from '../charts/LiquidityChart';
import { Skeleton } from '../ui/Skeleton';
import { Badge } from '../ui/Badge';

export function LiquiditySection({ ticker }: { ticker: string }) {
  const { data, isLoading } = useLiquidity(ticker);

  if (isLoading) return <Skeleton className="h-80 w-full" />;
  if (!data || data.length === 0) return null;

  return (
    <Card glass>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">السيولة (شراء/بيع)</h3>
        {data[0]?.isMock && <Badge variant="mock">بيانات تجريبية</Badge>}
      </div>
      <LiquidityChart data={data} />
    </Card>
  );
}
