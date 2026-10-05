import React from 'react';
import { MarketSnapshot } from '../components/market/MarketSnapshot';
import { IndexCard } from '../components/market/IndexCard';
import { MarketChart } from '../components/market/MarketChart';
import { SectorHeatmap } from '../components/market/SectorHeatmap';
import { TopMovers } from '../components/market/TopMovers';
import MostUndervalued from '../components/dashboard/MostUndervalued';
import { NewsSection } from '../components/market/NewsSection';
import { MarketFactors } from '../components/market/MarketFactors';
import { useIndices } from '../hooks/useMarketData';
import { Skeleton } from '../components/ui/Skeleton';

import { motion } from 'framer-motion';

export default function LandingPage() {
  const { data: indices, isLoading } = useIndices();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="max-w-7xl mx-auto px-4 py-8 space-y-10"
    >
      {/* Header section */}
      <motion.section variants={item} className="mb-12 text-center mt-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-l from-indigo-600 via-indigo-500 to-indigo-400 drop-shadow-sm">
          نظرة عامة على السوق
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          أحدث بيانات البورصة المصرية وأكثر الأسهم نشاطاً في الوقت الفعلي
        </p>
      </motion.section>
      
      <motion.section variants={item}>
        <MarketSnapshot />
      </motion.section>

      {/* Indices */}
      <motion.section variants={item} className="grid md:grid-cols-3 gap-6 relative z-10">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </>
        ) : (
          indices?.map(index => <IndexCard key={index.name} index={index} />)
        )}
      </motion.section>

      {/* Main Chart and Sectors */}
      <motion.section variants={item} className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MarketChart />
        </div>
        <div>
          <SectorHeatmap />
        </div>
      </motion.section>

      {/* Movers & Undervalued */}
      <motion.section variants={item} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 px-2">حركة الأسهم</h2>
          <TopMovers />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 invisible">.</h2>
          <MostUndervalued />
        </div>
      </motion.section>

      {/* News */}
      <motion.section variants={item}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 px-2">آخر الأخبار</h2>
        <NewsSection />
      </motion.section>

      {/* Market Factors */}
      <motion.section variants={item}>
        <MarketFactors />
      </motion.section>
    </motion.div>
  );
}
