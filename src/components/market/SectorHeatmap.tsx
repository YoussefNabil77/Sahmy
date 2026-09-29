import React from 'react';
import { Card } from '../ui/Card';
import { useSectors } from '../../hooks/useMarketData';
import { formatPercent } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';

export function SectorHeatmap() {
  const { data: sectors, isLoading } = useSectors();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!sectors) return null;

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">أداء القطاعات</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sectors.map(sector => {
          const isUp = sector.changePct >= 0;
          const bgOpacity = Math.min(Math.abs(sector.changePct) / 3, 1);
          return (
            <div 
              key={sector.id} 
              className="p-3 rounded-lg flex flex-col justify-between"
              style={{ 
                backgroundColor: isUp ? `rgba(16, 185, 129, ${bgOpacity * 0.5 + 0.1})` : `rgba(239, 68, 68, ${bgOpacity * 0.5 + 0.1})`,
                border: `1px solid ${isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}
            >
              <span className="text-sm font-medium mb-2 truncate" title={sector.name}>{sector.name}</span>
              <span className={`font-bold ${isUp ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {formatPercent(sector.changePct)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
