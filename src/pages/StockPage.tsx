import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, TrendingUp } from 'lucide-react';
import { useStockQuote, useStockPriceHistory } from '../hooks/useStockData';
import { fetchSearchSuggestions } from '../services/marketApi';
import { StockHeader } from '../components/stock/StockHeader';
import { KpiCards } from '../components/stock/KpiCards';
import { OwnershipSection } from '../components/stock/OwnershipSection';
import { LiquiditySection } from '../components/stock/LiquiditySection';
import { GrowthSection } from '../components/stock/GrowthSection';
import { StockPriceChart } from '../components/charts/StockPriceChart';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import type { SearchSuggestion } from '../types';

const RANGES = [
  { key: '1M', label: 'شهر' },
  { key: '3M', label: '3 أشهر' },
  { key: '6M', label: '6 أشهر' },
  { key: '1Y', label: 'سنة' },
];

const QUICK_TICKERS = ['COMI', 'HRHO', 'ETEL', 'SWDY', 'AMOC'];

export default function StockPage() {
  const { ticker: paramTicker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  // All hooks must be at the top — no conditional hooks
  const [inputValue, setInputValue] = useState(paramTicker ?? '');
  const [activeTicker, setActiveTicker] = useState(paramTicker ?? '');
  const [range, setRange] = useState('3M');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (paramTicker) {
      setActiveTicker(paramTicker.toUpperCase());
      setInputValue(paramTicker.toUpperCase());
    }
  }, [paramTicker]);

  useEffect(() => {
    if (inputValue.length < 1) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      const res = await fetchSearchSuggestions(inputValue);
      setSuggestions(res.slice(0, 8));
      setShowSuggestions(true);
    }, 200);
    return () => clearTimeout(t);
  }, [inputValue]);

  const handleSearch = useCallback(() => {
    const q = inputValue.trim().toUpperCase();
    if (!q) return;
    setActiveTicker(q);
    navigate(`/stock/${q}`);
    setShowSuggestions(false);
  }, [inputValue, navigate]);

  const { data: quote, isLoading: quoteLoading } = useStockQuote(activeTicker);
  const { data: history, isLoading: historyLoading } = useStockPriceHistory(activeTicker, range);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Search bar */}
      <div className="relative max-w-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400" />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="أدخل رمز السهم (مثال: COMI، HRHO، ETEL)"
              className="w-full ps-10 pe-4 py-3 text-base rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-semibold"
              style={{ borderColor: 'rgb(var(--surface-border))', color: 'rgb(var(--text-primary))', backgroundColor: 'rgb(var(--surface-card))' }}
              aria-label="البحث عن سهم"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            بحث <ChevronLeft size={16} />
          </button>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 w-full rounded-xl border shadow-xl z-50 overflow-hidden"
              style={{ backgroundColor: 'rgb(var(--surface-card))', borderColor: 'rgb(var(--surface-border))' }}
            >
              {suggestions.map(s => (
                <button
                  key={s.ticker}
                  onMouseDown={() => {
                    setInputValue(s.ticker);
                    setActiveTicker(s.ticker);
                    navigate(`/stock/${s.ticker}`);
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/10 text-sm transition-colors text-start"
                >
                  <span className="font-black text-emerald-500 w-16 shrink-0">{s.ticker}</span>
                  <span className="flex-1" style={{ color: 'rgb(var(--text-primary))' }}>{s.companyNameAr}</span>
                  <span className="text-xs" style={{ color: 'rgb(var(--text-secondary))' }}>{s.sector}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Empty state — no ticker yet */}
      {!activeTicker && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>ابدأ بالبحث عن سهم</h2>
          <p className="text-sm mb-6" style={{ color: 'rgb(var(--text-secondary))' }}>أدخل رمز السهم مثل COMI أو HRHO أو ETEL</p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_TICKERS.map(t => (
              <button
                key={t}
                onClick={() => { setInputValue(t); setActiveTicker(t); navigate(`/stock/${t}`); }}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {activeTicker && quoteLoading && (
        <div className="space-y-4">
          <Skeleton className="h-52" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      )}

      {/* Not found state */}
      {activeTicker && !quoteLoading && !quote && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'rgb(var(--text-primary))' }}>لم يتم العثور على السهم</h2>
          <p className="text-sm" style={{ color: 'rgb(var(--text-secondary))' }}>تأكد من صحة رمز السهم وحاول مرة أخرى</p>
        </div>
      )}

      {/* Stock content */}
      <AnimatePresence>
        {activeTicker && quote && !quoteLoading && (
          <motion.div
            key={activeTicker}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <StockHeader quote={quote} />
            <KpiCards quote={quote} />

            {/* Price chart */}
            <Card>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h3 className="text-base font-bold" style={{ color: 'rgb(var(--text-primary))' }}>مخطط السعر</h3>
                <div className="flex gap-1">
                  {RANGES.map(r => (
                    <button
                      key={r.key}
                      onClick={() => setRange(r.key)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        range === r.key ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-500/10'
                      }`}
                      style={{ color: range === r.key ? undefined : 'rgb(var(--text-secondary))' }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {historyLoading ? (
                <Skeleton className="h-80" />
              ) : history ? (
                <StockPriceChart data={history} />
              ) : null}

              {/* Trend explanation */}
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgb(var(--surface-bg))' }}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <h4 className="text-sm font-bold" style={{ color: 'rgb(var(--text-primary))' }}>اتجاه السهم</h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgb(var(--text-secondary))' }}>
                  {quote.trendExplanation}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OwnershipSection ticker={activeTicker} />
              <LiquiditySection ticker={activeTicker} />
            </div>

            <GrowthSection ticker={activeTicker} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
