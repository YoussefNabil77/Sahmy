import React from 'react';
import { Card } from '../ui/Card';
import type { StockQuote } from '../../types';
import { formatCompact, formatNumber } from '../../lib/utils';

export function KpiCards({ quote }: { quote: StockQuote }) {
  const kpis = [
    { label: 'حجم التداول', value: formatCompact(quote.volume) },
    { label: 'قيمة التداول', value: `${formatCompact(quote.tradedValue)} ج.م` },
    { label: 'القيمة السوقية', value: `${formatCompact(quote.marketCap)} ج.م` },
    { label: 'مضاعف الربحية (P/E)', value: quote.peRatio ? formatNumber(quote.peRatio) : '-' },
    { label: 'أعلى 52 أسبوع', value: formatNumber(quote.weekHigh52) },
    { label: 'أدنى 52 أسبوع', value: formatNumber(quote.weekLow52) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, i) => (
        <Card key={i} className="p-4 text-center flex flex-col justify-center items-center">
          <span className="text-xs mb-2" style={{ color: 'rgb(var(--text-secondary))' }}>{kpi.label}</span>
          <span className="text-lg font-bold">{kpi.value}</span>
        </Card>
      ))}
    </div>
  );
}
