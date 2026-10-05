import React from 'react';
import { Card } from '../ui/Card';
import { formatCompact } from '../../lib/utils';
import { useIndices } from '../../hooks/useMarketData';

export function MarketSnapshot() {
  const { data: indices } = useIndices();
  const egx30 = indices?.find(i => i.name === 'EGX 30');

  if (!egx30) return null;

  return (
    <Card glass className="flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-l from-indigo-500/10 to-transparent">
      <div>
        <h2 className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>حالة السوق</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-lg font-bold">مفتوح</span>
        </div>
      </div>
      <div className="flex gap-8">
        <div>
          <h3 className="text-sm mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>حجم التداول</h3>
          <p className="text-lg font-bold">{formatCompact(egx30.volume)}</p>
        </div>
        <div>
          <h3 className="text-sm mb-1" style={{ color: 'rgb(var(--text-secondary))' }}>قيمة التداول</h3>
          <p className="text-lg font-bold">{formatCompact(egx30.tradedValue)} ج.م</p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="text-center">
          <span className="block text-indigo-500 font-bold">{egx30.advancing}</span>
          <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>ارتفاع</span>
        </div>
        <div className="text-center">
          <span className="block text-slate-400 font-bold">{egx30.unchanged}</span>
          <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>ثبات</span>
        </div>
        <div className="text-center">
          <span className="block text-red-500 font-bold">{egx30.declining}</span>
          <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>انخفاض</span>
        </div>
      </div>
    </Card>
  );
}
