import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, DollarSign, Landmark, TrendingUp, ShieldCheck, Activity, Layers } from 'lucide-react';
import { fetchHotMoneyFlows, type HotMoneyFlows } from '../../services/marketApi';

export function HotMoneyFlowWidget() {
  const { data: flows, isLoading } = useQuery<HotMoneyFlows | null>({
    queryKey: ['hot-money-flows'],
    queryFn: fetchHotMoneyFlows,
    staleTime: 300_000,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-3/4"></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-200/40 dark:bg-slate-800/40 rounded-2xl"></div>
          <div className="h-44 bg-slate-200/40 dark:bg-slate-800/40 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!flows) return null;

  const { usdEgpRate, centralBank, egxEquities } = flows;

  // Central bank flow percentage
  const cbTotal = centralBank.monthlyInflowUsd + centralBank.monthlyOutflowUsd;
  const cbInflowPct = cbTotal > 0 ? Math.round((centralBank.monthlyInflowUsd / cbTotal) * 100) : 50;

  // EGX flow percentage
  const egxTotal = egxEquities.foreignBuyInflowUsd + egxEquities.foreignSellOutflowUsd;
  const egxInflowPct = egxTotal > 0 ? Math.round((egxEquities.foreignBuyInflowUsd / egxTotal) * 100) : 50;

  return (
    <div className="space-y-6">
      {/* Top Highlight Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-orange-500/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">
            <DollarSign size={14} />
            <span>سعر صرف الدولار</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {usdEgpRate.toFixed(2)} <span className="text-xs font-medium text-slate-400">ج.م</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Investing.com لحظي</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-emerald-500/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Landmark size={14} />
            <span>محفظة أذون الخزانة</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ${centralBank.totalHotMoneyHoldingsUsd} <span className="text-xs font-medium text-slate-400">مليار</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">رصيد الأموال الساخنة</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-indigo-500/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <ShieldCheck size={14} />
            <span>صافي الأصول الأجنبية</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            +${centralBank.netForeignAssetsUsd} <span className="text-xs font-medium text-slate-400">مليار</span>
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">فائض بالقطاع المصرفي</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-blue-500/20 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Layers size={14} />
            <span>احتياطي النقد الأجنبي</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ${centralBank.foreignReservesUsd} <span className="text-xs font-medium text-slate-400">مليار</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">لدى البنك المركزي المصري</div>
        </div>
      </div>

      {/* Main 2 Pillars: Central Bank vs EGX Stock Market */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Pillar 1: Central Bank & T-Bills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                <Landmark size={18} />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  البنك المركزي وأدوات الدين
                </h4>
                <p className="text-xs text-slate-400">سوق أذون الخزانة الحكومية (T-Bills & Carry Trade)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ArrowDownRight size={13} /> صافي دخول
            </span>
          </div>

          {/* Dollar Flow Numbers (In vs Out) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <ArrowDownRight size={14} /> الدولار الداخل (شهرياً)
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                +${centralBank.monthlyInflowUsd}{' '}
                <span className="text-xs font-normal text-slate-400">مليار $</span>
              </div>
              <div className="text-[11px] text-slate-400">تدفقات استثمار الأجانب الجديدة</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
              <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
                <ArrowUpRight size={14} /> الدولار الخارج (شهرياً)
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                -${centralBank.monthlyOutflowUsd}{' '}
                <span className="text-xs font-normal text-slate-400">مليار $</span>
              </div>
              <div className="text-[11px] text-slate-400">استحقاقات أذون وجني أرباح</div>
            </div>
          </div>

          {/* Ratio bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span className="text-emerald-600 dark:text-emerald-400">دخول: {cbInflowPct}%</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                صافي الفائض: +${centralBank.netMonthlyFlowUsd} مليار $
              </span>
              <span className="text-rose-600 dark:text-rose-400">خروج: {100 - cbInflowPct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${cbInflowPct}%` }} className="bg-emerald-500 h-full rounded-s-full transition-all duration-500" />
              <div style={{ width: `${100 - cbInflowPct}%` }} className="bg-rose-500 h-full rounded-e-full transition-all duration-500" />
            </div>
          </div>

          {/* Details */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              متوسط عائد أذون الخزانة:{' '}
              <strong className="text-slate-900 dark:text-white">{centralBank.tBillYieldAvg}%</strong>
            </span>
            <span className="text-slate-500">
              العائد الحقيقي بعد التضخم:{' '}
              <strong className="text-emerald-500 font-bold">+{centralBank.realInterestRate}%</strong>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
            ℹ️ {centralBank.statusNote}
          </p>
        </motion.div>

        {/* Pillar 2: EGX Stock Market Equities */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl p-5 bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  البورصة المصرية (سوق الأسهم)
                </h4>
                <p className="text-xs text-slate-400">حركة دخول وخروج سيولة المستثمرين الأجانب</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Activity size={13} /> صافي شراء
            </span>
          </div>

          {/* Dollar Flow Numbers (In vs Out) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <ArrowDownRight size={14} /> مشتريات الأجانب (دخول)
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                +${egxEquities.foreignBuyInflowUsd}{' '}
                <span className="text-xs font-normal text-slate-400">مليون $</span>
              </div>
              <div className="text-[11px] text-slate-400">سيولة شراء مؤسسات أجنبية</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15">
              <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
                <ArrowUpRight size={14} /> مبيعات الأجانب (خروج)
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                -${egxEquities.foreignSellOutflowUsd}{' '}
                <span className="text-xs font-normal text-slate-400">مليون $</span>
              </div>
              <div className="text-[11px] text-slate-400">سيولة تسييل وجني أرباح</div>
            </div>
          </div>

          {/* Ratio bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span className="text-emerald-600 dark:text-emerald-400">شراء: {egxInflowPct}%</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                صافي التدفق: +${egxEquities.netForeignFlowUsd}M (+{egxEquities.netForeignFlowEgp}M ج.م)
              </span>
              <span className="text-rose-600 dark:text-rose-400">بيع: {100 - egxInflowPct}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${egxInflowPct}%` }} className="bg-emerald-500 h-full rounded-s-full transition-all duration-500" />
              <div style={{ width: `${100 - egxInflowPct}%` }} className="bg-rose-500 h-full rounded-e-full transition-all duration-500" />
            </div>
          </div>

          {/* Details & Target Stocks */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-500">
              <span>حصة الأجانب من تداولات اليوم:</span>
              <strong className="text-slate-900 dark:text-white">{egxEquities.foreignParticipationPct}%</strong>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400">الأسهم الأكثر استهدافاً:</span>
              {egxEquities.topForeignTargets.slice(0, 3).map((stock, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold"
                >
                  {stock}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
            ℹ️ {egxEquities.statusNote}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
