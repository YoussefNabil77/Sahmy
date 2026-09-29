import React from 'react';
import { Card } from '../ui/Card';
import { useTopGainers, useTopLosers, useMostActive } from '../../hooks/useMarketData';
import { formatNumber, formatPercent, formatCompact } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import type { StockMover } from '../../types';

function MoverList({ title, data, type }: { title: string, data?: StockMover[], type: 'gainers' | 'losers' | 'active' }) {
  if (!data) return <Skeleton className="h-64 w-full" />;
  
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="divide-y" style={{ borderColor: 'rgb(var(--surface-border))' }}>
        {data.map(stock => (
          <Link key={stock.ticker} to={`/stock/${stock.ticker}`} className="flex items-center justify-between py-3 hover:bg-[rgb(var(--surface-bg))] transition-colors px-2 -mx-2 rounded-lg">
            <div>
              <div className="font-bold">{stock.ticker}</div>
              <div className="text-xs max-w-[120px] truncate" style={{ color: 'rgb(var(--text-secondary))' }}>{stock.companyName}</div>
            </div>
            <div className="text-end">
              <div className="font-medium">{formatNumber(stock.price)}</div>
              {type === 'active' ? (
                <div className="text-xs text-slate-500">{formatCompact(stock.volume)} سهم</div>
              ) : (
                <div className={`text-sm font-bold ${stock.changePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatPercent(stock.changePct)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function TopMovers() {
  const { data: gainers } = useTopGainers();
  const { data: losers } = useTopLosers();
  const { data: active } = useMostActive();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <MoverList title="الأسهم الأكثر ارتفاعاً" data={gainers} type="gainers" />
      <MoverList title="الأسهم الأكثر انخفاضاً" data={losers} type="losers" />
      <MoverList title="الأنشط من حيث الكمية" data={active} type="active" />
    </div>
  );
}
