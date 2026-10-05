import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, TrendingUp, Flame, Droplets, Globe, DollarSign, Newspaper } from 'lucide-react';
import { fetchMarketFactors, type MarketFactorsData, type FactorItem } from '../../services/marketApi';
import { HotMoneyFlowWidget } from './HotMoneyFlowWidget';

const TABS = [
  {
    key: 'interest' as const,
    label: 'الفائدة',
    icon: TrendingUp,
    color: 'indigo',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-500',
    border: 'border-indigo-500/30',
    activeBg: 'bg-indigo-500',
    description: 'قرارات أسعار الفائدة وسياسات البنوك المركزية',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
  },
  {
    key: 'hotMoney' as const,
    label: 'الأموال الساخنة',
    icon: Flame,
    color: 'orange',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/30',
    activeBg: 'bg-orange-500',
    description: 'تدفقات رأس المال والاستثمار الأجنبي المباشر',
    gradient: 'from-orange-500/20 to-orange-600/5',
  },
  {
    key: 'oil' as const,
    label: 'سعر البترول',
    icon: Droplets,
    color: 'emerald',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/30',
    activeBg: 'bg-emerald-500',
    description: 'أسعار الخام وتأثيرها على الاقتصاد المصري',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    key: 'geo' as const,
    label: 'الأحوال الجيوسياسية',
    icon: Globe,
    color: 'rose',
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    border: 'border-rose-500/30',
    activeBg: 'bg-rose-500',
    description: 'التوترات الإقليمية وتأثيرها على الأسواق',
    gradient: 'from-rose-500/20 to-rose-600/5',
  },
];

function NewsItem({ item, index }: { item: FactorItem; index: number }) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex items-start gap-3 group p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer"
    >
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-500 transition-colors" style={{ color: 'rgb(var(--text-primary))' }}>
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>Investing.com</span>
        </div>
      </div>
      <ExternalLink size={13} className="shrink-0 mt-1 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'rgb(var(--text-secondary))' }} />
    </motion.a>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-3 p-3 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-200/80 rounded-full w-full" />
            <div className="h-3 bg-slate-200/80 rounded-full w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MarketFactors() {
  const [activeTab, setActiveTab] = useState<'interest' | 'hotMoney' | 'oil' | 'geo'>('interest');
  const [hotMoneyView, setHotMoneyView] = useState<'flows' | 'news'>('flows');
  const { data, isLoading } = useQuery({
    queryKey: ['market-factors'],
    queryFn: fetchMarketFactors,
    staleTime: 600_000,
  });

  const currentTab = TABS.find(t => t.key === activeTab)!;
  const currentItems = data?.[activeTab] ?? [];
  const Icon = currentTab.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: 'rgb(var(--surface-card))',
        borderColor: 'rgb(var(--surface-border))',
        boxShadow: '0 4px 40px -10px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-indigo-500 rounded-full" />
          <h2 className="text-xl font-black" style={{ color: 'rgb(var(--text-primary))' }}>
            أهم الأخبار والمؤشرات المؤثرة
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pr-4">
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>
            {currentTab.description}
          </p>

          {/* Sub-view switcher for Hot Money */}
          {activeTab === 'hotMoney' && (
            <div className="flex items-center p-1 bg-orange-500/10 rounded-xl border border-orange-500/20 text-xs font-bold shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setHotMoneyView('flows')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  hotMoneyView === 'flows'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-orange-600 dark:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <DollarSign size={13} />
                تدفقات الدولار (المركزي والبورصة)
              </button>
              <button
                onClick={() => setHotMoneyView('news')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  hotMoneyView === 'news'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-orange-600 dark:text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <Newspaper size={13} />
                أحدث الأخبار
              </button>
            </div>
          )}
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 border-b pb-0" style={{ borderColor: 'rgb(var(--surface-border))' }}>
          {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all duration-200 ${
                  isActive
                    ? `${tab.text} border border-b-0 bg-white/80 dark:bg-white/5`
                    : `hover:${tab.bg} opacity-60 hover:opacity-100`
                }`}
                style={isActive ? { borderColor: 'rgb(var(--surface-border))' } : undefined}
              >
                <TabIcon size={15} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.activeBg}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className={`bg-gradient-to-br ${currentTab.gradient} min-h-[220px]`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${activeTab === 'hotMoney' ? hotMoneyView : 'all'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {activeTab === 'hotMoney' && hotMoneyView === 'flows' ? (
              <HotMoneyFlowWidget />
            ) : isLoading ? (
              <SkeletonList />
            ) : currentItems.length === 0 ? (
              <div className="py-10 text-center">
                <Icon size={32} className={`mx-auto mb-3 ${currentTab.text} opacity-30`} />
                <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
                  لا توجد أخبار متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {currentItems.map((item, i) => (
                  <NewsItem key={item.url} item={item} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-3 flex items-center justify-between border-t"
        style={{ borderColor: 'rgb(var(--surface-border))' }}
      >
        <span className="text-xs font-medium" style={{ color: 'rgb(var(--text-secondary))' }}>
          المصدر: Investing.com — يتجدد كل 10 دقائق
        </span>
        <a
          href="https://sa.investing.com/news/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs font-bold flex items-center gap-1 ${currentTab.text} hover:underline`}
        >
          المزيد <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
