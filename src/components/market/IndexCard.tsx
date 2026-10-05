import React from 'react';
import { Card } from '../ui/Card';
import { formatNumber, formatPercent } from '../../lib/utils';
import type { IndexSnapshot } from '../../types';
import { SparklineChart } from '../charts/SparklineChart';

export function IndexCard({ index }: { index: IndexSnapshot }) {
  const isUp = index.change >= 0;
  return (
    <Card glass className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{index.name}</h3>
          <p className="text-sm uppercase" style={{ color: 'rgb(var(--text-secondary))' }}>{index.nameEn}</p>
        </div>
        <SparklineChart data={index.sparkline} color={isUp ? '#10b981' : '#ef4444'} />
      </div>
      <div>
        <p className="text-2xl font-black mb-1">{formatNumber(index.value)}</p>
        <div className="flex items-center gap-2">
          <span className={isUp ? 'text-up font-bold' : 'text-down font-bold'}>
            {formatPercent(index.changePct)}
          </span>
          <span className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            {formatNumber(index.change)}
          </span>
        </div>
      </div>
    </Card>
  );
}
