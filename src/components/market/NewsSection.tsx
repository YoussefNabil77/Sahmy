import React from 'react';
import { Card } from '../ui/Card';
import { useNews } from '../../hooks/useMarketData';
import { formatRelativeTime } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { ExternalLink } from 'lucide-react';

export function NewsSection() {
  const { data: news, isLoading } = useNews();

  if (isLoading) return <Skeleton className="h-80 w-full" />;
  if (!news) return null;

  const featured = news.find(n => n.isFeatured);
  const others = news.filter(n => !n.isFeatured).slice(0, 4);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {featured && (
        <Card className="md:col-span-2 relative overflow-hidden group">
          {featured.imageUrl && (
            <div className="absolute inset-0 z-0">
              <img src={featured.imageUrl} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--surface-card))] to-transparent" />
            </div>
          )}
          <div className="relative z-10 flex flex-col h-full justify-end">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{featured.source}</span>
              <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>{formatRelativeTime(featured.publishedAt)}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 line-clamp-2 leading-tight">{featured.title}</h3>
            <p className="mb-4 line-clamp-2" style={{ color: 'rgb(var(--text-secondary))' }}>{featured.excerpt}</p>
            <a href={featured.url} className="inline-flex items-center gap-1 text-sm font-medium text-emerald-500 hover:underline w-fit">
              اقرأ المزيد <ExternalLink size={14} />
            </a>
          </div>
        </Card>
      )}
      <div className="flex flex-col gap-4">
        {others.map(item => (
          <a key={item.id} href={item.url} className="block group">
            <div className="text-xs mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--text-secondary))' }}>
              <span className="font-bold text-emerald-500">{item.source}</span>
              <span>•</span>
              <span>{formatRelativeTime(item.publishedAt)}</span>
            </div>
            <h4 className="font-semibold line-clamp-2 group-hover:text-emerald-500 transition-colors leading-snug">{item.title}</h4>
          </a>
        ))}
      </div>
    </div>
  );
}
