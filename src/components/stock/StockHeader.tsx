import React from 'react';
import type { StockQuote } from '../../types';
import { formatNumber, formatPercent } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export function StockHeader({ quote }: { quote: StockQuote }) {
  const isUp = quote.change >= 0;
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-black">{quote.ticker}</h1>
          <Badge>{quote.sectorAr}</Badge>
        </div>
        <h2 className="text-xl" style={{ color: 'rgb(var(--text-secondary))' }}>{quote.companyNameAr}</h2>
        <p className="text-sm mt-1" style={{ color: 'rgb(var(--text-secondary))' }}>{quote.companyName}</p>
      </div>
      <div className="text-end">
        <div className="text-sm mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>السعر الحالي</div>
        <div className="flex items-baseline gap-3 justify-end">
          <span className="text-5xl font-black">{formatNumber(quote.price)}</span>
          <span className="text-lg font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>ج.م</span>
        </div>
        <div className={`flex items-center justify-end gap-2 text-xl font-bold mt-2 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
          <span>{isUp ? '▲' : '▼'} {formatNumber(Math.abs(quote.change))}</span>
          <span>({formatPercent(quote.changePct)})</span>
        </div>
      </div>
    </div>
  );
}
