import React from 'react';
import { MarketSnapshot } from '../components/market/MarketSnapshot';
import { IndexCard } from '../components/market/IndexCard';
import { MarketChart } from '../components/market/MarketChart';
import { SectorHeatmap } from '../components/market/SectorHeatmap';
import { TopMovers } from '../components/market/TopMovers';
import MostUndervalued from '../components/dashboard/MostUndervalued';
import { NewsSection } from '../components/market/NewsSection';
import { useIndices } from '../hooks/useMarketData';
import { Skeleton } from '../components/ui/Skeleton';

export default function LandingPage() {
  const { data: indices, isLoading } = useIndices();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <section>
        <h1 className="text-3xl font-black mb-6">نظرة عامة على السوق</h1>
        <MarketSnapshot />
      </section>

      {/* Indices */}
      <section className="grid md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          indices?.map(index => <IndexCard key={index.name} index={index} />)
        )}
      </section>

      {/* Main Chart and Sectors */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MarketChart />
        </div>
        <div>
          <SectorHeatmap />
        </div>
      </section>

      {/* Movers & Undervalued */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">حركة الأسهم</h2>
          <TopMovers />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 invisible">.</h2>
          <MostUndervalued />
        </div>
      </section>

      {/* News */}
      <section>
        <h2 className="text-2xl font-bold mb-6">آخر الأخبار</h2>
        <NewsSection />
      </section>
    </div>
  );
}
