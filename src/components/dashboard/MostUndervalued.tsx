import { Card } from '../ui/Card';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingDown, HelpCircle, ArrowRight } from 'lucide-react';
import { fetchUndervalued } from '../../services/marketApi';
import { Link } from 'react-router-dom';

export default function MostUndervalued() {
  const { data: undervalued, isLoading } = useQuery({
    queryKey: ['undervalued-stocks'],
    queryFn: fetchUndervalued,
    refetchInterval: 300000,
  });

  if (isLoading) {
    return (
      <Card glass className="animate-pulse h-[400px]">
        <div className="h-6 w-48 bg-slate-200/50 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-100/50 rounded-xl"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (!undervalued || undervalued.length === 0) return null;

  return (
    <Card glass className="relative overflow-hidden group p-0 sm:p-0">
      <div className="p-6">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50" />
      
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">أكثر الأسهم جاذبية</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              مقومة بأقل من قيمتها العادلة (حسب مكرر الربحية)
            </p>
          </div>
        </div>
        <div className="group/tooltip relative">
          <HelpCircle className="w-5 h-5 text-slate-400 cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 text-center shadow-xl">
            يتم تحديد هذه الأسهم بناءً على أدنى مكرر ربحية (P/E) مع استبعاد الشركات الخاسرة. هذه البيانات حقيقية من السوق المصري مقدمة عبر منصة TradingView، كبديل للبيانات المحجوبة في Investing.com.
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      </div>

      <div className="space-y-3 relative">
        {undervalued.slice(0, 5).map((stock, i) => (
          <Link key={stock.ticker} to={`/stock/${stock.ticker}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/30 transition-all cursor-pointer group/card bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-100 group-hover/card:bg-indigo-100 group-hover/card:text-indigo-700 transition-colors">
                  {stock.ticker}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 group-hover/card:text-indigo-700 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                    {stock.companyName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      P/E: {stock.peRatio?.toFixed(2) || 'N/A'}
                    </span>
                    {stock.pbRatio && (
                      <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        P/B: {stock.pbRatio.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="font-bold text-slate-900 flex justify-end items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover/card:text-indigo-500 group-hover/card:-translate-x-1 transition-all opacity-0 group-hover/card:opacity-100" />
                  {stock.price.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold flex justify-end items-center gap-1 mt-1 ${stock.changePct > 0 ? 'text-positive-main' : stock.changePct < 0 ? 'text-negative-main' : 'text-slate-500'}`}>
                  <span dir="ltr">{stock.changePct > 0 ? '+' : ''}{stock.changePct.toFixed(2)}%</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
      </div>
    </Card>
  );
}
