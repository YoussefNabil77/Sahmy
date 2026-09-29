import type {
  IndexSnapshot,
  IndexHistoryPoint,
  Sector,
  NewsItem,
  StockMover,
  StockQuote,
  PricePoint,
  OwnershipItem,
  LiquidityDay,
  FinancialPeriod,
  SearchSuggestion,
} from '../types';

// ── Indices ──────────────────────────────────────────────────────────────────
export const MOCK_INDICES: IndexSnapshot[] = [
  {
    name: 'EGX 30',
    nameEn: 'EGX30',
    value: 31_456.78,
    change: 412.35,
    changePct: 1.33,
    volume: 487_234_500,
    tradedValue: 2_845_670_000,
    advancing: 18,
    declining: 8,
    unchanged: 4,
    lastUpdate: new Date().toISOString(),
    sparkline: [30200, 30450, 30100, 30800, 31100, 30900, 31456],
  },
  {
    name: 'EGX 70',
    nameEn: 'EGX70',
    value: 7_892.41,
    change: -54.12,
    changePct: -0.68,
    volume: 123_456_789,
    tradedValue: 654_321_000,
    advancing: 28,
    declining: 35,
    unchanged: 7,
    lastUpdate: new Date().toISOString(),
    sparkline: [7950, 7920, 7880, 7900, 7910, 7930, 7892],
  },
  {
    name: 'EGX 100',
    nameEn: 'EGX100',
    value: 12_345.67,
    change: 89.23,
    changePct: 0.73,
    volume: 612_345_678,
    tradedValue: 3_512_450_000,
    advancing: 48,
    declining: 39,
    unchanged: 13,
    lastUpdate: new Date().toISOString(),
    sparkline: [12100, 12200, 12150, 12280, 12310, 12290, 12345],
  },
];

// ── Index History ────────────────────────────────────────────────────────────
function generateHistory(baseValue: number, days: number): IndexHistoryPoint[] {
  const points: IndexHistoryPoint[] = [];
  let val = baseValue * 0.88;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Skip weekends
    if (date.getDay() === 5 || date.getDay() === 6) continue;
    val += val * (Math.random() - 0.48) * 0.015;
    val = Math.max(val, baseValue * 0.7);
    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(val * 100) / 100,
      volume: Math.floor(Math.random() * 300_000_000 + 200_000_000),
    });
  }
  return points;
}

export const MOCK_INDEX_HISTORY: Record<string, IndexHistoryPoint[]> = {
  '1W': generateHistory(31_456, 7),
  '1M': generateHistory(31_456, 30),
  '3M': generateHistory(31_456, 90),
};

// ── Sectors ──────────────────────────────────────────────────────────────────
export const MOCK_SECTORS: Sector[] = [
  { id: 'banking', name: 'البنوك والخدمات المالية', changePct: 2.14, tradedValue: 1_234_567_000, volume: 234_567_890, stockCount: 12 },
  { id: 'real-estate', name: 'العقارات والإنشاءات', changePct: -0.87, tradedValue: 456_789_000, volume: 123_456_789, stockCount: 18 },
  { id: 'telecom', name: 'الاتصالات والتكنولوجيا', changePct: 1.56, tradedValue: 789_012_000, volume: 87_654_321, stockCount: 7 },
  { id: 'energy', name: 'الطاقة والبترول والغاز', changePct: 0.34, tradedValue: 234_567_000, volume: 45_678_901, stockCount: 9 },
  { id: 'consumer', name: 'السلع الاستهلاكية', changePct: -1.23, tradedValue: 345_678_000, volume: 67_890_123, stockCount: 14 },
  { id: 'industry', name: 'الصناعات المتنوعة', changePct: 0.78, tradedValue: 123_456_000, volume: 34_567_890, stockCount: 22 },
  { id: 'food', name: 'الأغذية والمشروبات', changePct: -0.45, tradedValue: 98_765_000, volume: 23_456_789, stockCount: 11 },
  { id: 'pharma', name: 'الأدوية والصحة', changePct: 1.89, tradedValue: 167_890_000, volume: 45_123_456, stockCount: 8 },
];

// ── News ─────────────────────────────────────────────────────────────────────
export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'البورصة المصرية تواصل مكاسبها وسط تدفق رؤوس الأموال الأجنبية',
    excerpt: 'شهدت البورصة المصرية جلسة إيجابية بامتياز اليوم، حيث ارتفع مؤشر EGX30 بنسبة 1.33% مدعوماً بالمشتريات القوية في قطاع البنوك والاتصالات.',
    source: 'البورصة نيوز',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    url: '#',
    isFeatured: true,
    imageUrl: 'https://picsum.photos/seed/egx1/800/400',
  },
  {
    id: '2',
    title: 'CIB يسجل أعلى مستوى له منذ عامين',
    excerpt: 'سهم البنك التجاري الدولي يرتفع 3.2% ليتخطى حاجز 90 جنيهاً للسهم.',
    source: 'مال وأعمال',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    url: '#',
  },
  {
    id: '3',
    title: 'صافي استثمارات الأجانب يتخطى 450 مليون جنيه في أسبوع',
    excerpt: 'تواصل التدفقات الاستثمارية الأجنبية دخول السوق المصري بشكل ملحوظ في ظل تحسن مناخ الاستثمار.',
    source: 'الشروق الاقتصادي',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    url: '#',
  },
  {
    id: '4',
    title: 'قطاع العقارات يتراجع وسط ضغوط التضخم',
    excerpt: 'يواجه قطاع العقارات ضغوطاً من ارتفاع أسعار مواد البناء والفائدة المرتفعة.',
    source: 'دوت مصر',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    url: '#',
  },
  {
    id: '5',
    title: 'موبايلنج مصر تستعد لإطلاق منتجات مالية جديدة',
    excerpt: 'أعلنت الشركة عن خططها للتوسع في خدمات المحافظ الرقمية والدفع الإلكتروني خلال الربع القادم.',
    source: 'تك عربي',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    url: '#',
  },
  {
    id: '6',
    title: 'الهيئة المالية تُحدّث قواعد الإفصاح للشركات المقيّدة',
    excerpt: 'قرارات جديدة من الهيئة العامة للرقابة المالية تُلزم الشركات بالإفصاح الفوري عن التغيرات الجوهرية.',
    source: 'أموال الغد',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    url: '#',
  },
];

// ── Top Movers ───────────────────────────────────────────────────────────────
export const MOCK_TOP_GAINERS: StockMover[] = [
  { ticker: 'CLHO', companyName: 'القاهرة للإسكان والتعمير', price: 12.45, change: 0.87, changePct: 7.52, volume: 45_678_901, tradedValue: 568_412_000 },
  { ticker: 'EKHO', companyName: 'إيكو للتطوير العقاري', price: 8.73, change: 0.55, changePct: 6.72, volume: 23_456_789, tradedValue: 204_677_000 },
  { ticker: 'PHDC', companyName: 'مصر الجديدة للإسكان والتنمية', price: 19.80, change: 1.20, changePct: 6.45, volume: 12_345_678, tradedValue: 244_444_000 },
  { ticker: 'MNHD', companyName: 'مدينة نصر للإسكان والتعمير', price: 55.30, change: 3.10, changePct: 5.94, volume: 8_765_432, tradedValue: 484_746_000 },
  { ticker: 'ISPH', companyName: 'المجموعة المصرية للأدوية', price: 34.15, change: 1.75, changePct: 5.40, volume: 6_543_210, tradedValue: 223_438_000 },
];

export const MOCK_TOP_LOSERS: StockMover[] = [
  { ticker: 'AMOC', companyName: 'الإسكندرية لتكرير البترول', price: 67.50, change: -5.20, changePct: -7.15, volume: 3_456_789, tradedValue: 233_233_000 },
  { ticker: 'NCGC', companyName: 'الشركة الوطنية للأسمنت', price: 15.30, change: -1.05, changePct: -6.43, volume: 9_876_543, tradedValue: 151_111_000 },
  { ticker: 'SVCE', companyName: 'سيرا للتطوير العقاري', price: 22.10, change: -1.40, changePct: -5.96, volume: 7_654_321, tradedValue: 169_156_000 },
  { ticker: 'MASR', companyName: 'مصر الخير للتمويل الأصغر', price: 9.80, change: -0.55, changePct: -5.32, volume: 15_432_109, tradedValue: 151_234_000 },
  { ticker: 'ORAS', companyName: 'أوراسكوم للاستثمار القابضة', price: 0.42, change: -0.022, changePct: -4.98, volume: 234_567_890, tradedValue: 98_518_000 },
];

export const MOCK_MOST_ACTIVE: StockMover[] = [
  { ticker: 'COMI', companyName: 'البنك التجاري الدولي', price: 92.30, change: 2.80, changePct: 3.13, volume: 123_456_789, tradedValue: 11_393_621_000 },
  { ticker: 'HRHO', companyName: 'هيرميس القابضة', price: 43.50, change: 0.90, changePct: 2.11, volume: 98_765_432, tradedValue: 4_296_396_000 },
  { ticker: 'ETEL', companyName: 'المصرية للاتصالات', price: 17.85, change: -0.25, changePct: -1.38, volume: 87_654_321, tradedValue: 1_564_630_000 },
  { ticker: 'ORAS', companyName: 'أوراسكوم للاستثمار القابضة', price: 0.42, change: -0.022, changePct: -4.98, volume: 234_567_890, tradedValue: 98_518_000 },
  { ticker: 'SWDY', companyName: 'السويدي إليكتريك', price: 28.75, change: 1.15, changePct: 4.17, volume: 45_678_901, tradedValue: 1_312_769_000 },
];

// ── Search Suggestions ───────────────────────────────────────────────────────
export const MOCK_SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { ticker: 'COMI', companyNameAr: 'البنك التجاري الدولي', sector: 'البنوك' },
  { ticker: 'HRHO', companyNameAr: 'هيرميس القابضة', sector: 'الخدمات المالية' },
  { ticker: 'ETEL', companyNameAr: 'المصرية للاتصالات', sector: 'الاتصالات' },
  { ticker: 'SWDY', companyNameAr: 'السويدي إليكتريك', sector: 'الصناعات' },
  { ticker: 'AMOC', companyNameAr: 'الإسكندرية لتكرير البترول', sector: 'الطاقة' },
  { ticker: 'SKPC', companyNameAr: 'سيدي كرير للبتروكيماويات', sector: 'الطاقة' },
  { ticker: 'MNHD', companyNameAr: 'مدينة نصر للإسكان والتعمير', sector: 'العقارات' },
  { ticker: 'PHDC', companyNameAr: 'مصر الجديدة للإسكان والتنمية', sector: 'العقارات' },
  { ticker: 'ISPH', companyNameAr: 'المجموعة المصرية للأدوية', sector: 'الأدوية' },
  { ticker: 'NCGC', companyNameAr: 'الشركة الوطنية للأسمنت', sector: 'مواد البناء' },
  { ticker: 'CLHO', companyNameAr: 'القاهرة للإسكان والتعمير', sector: 'العقارات' },
  { ticker: 'ORAS', companyNameAr: 'أوراسكوم للاستثمار القابضة', sector: 'الاستثمار' },
  { ticker: 'ESRS', companyNameAr: 'عز الدخيلة للصلب', sector: 'المعادن' },
  { ticker: 'ALCN', companyNameAr: 'الكيماويات العربية', sector: 'الصناعات الكيماوية' },
  { ticker: 'CIEB', companyNameAr: 'البنك التجاري الدولي - مصر', sector: 'البنوك' },
];

// ── Stock Quote ──────────────────────────────────────────────────────────────
export function getMockStockQuote(ticker: string): StockQuote {
  const stocks: Record<string, StockQuote> = {
    COMI: {
      ticker: 'COMI',
      companyName: 'Commercial International Bank',
      companyNameAr: 'البنك التجاري الدولي',
      sector: 'Banking',
      sectorAr: 'البنوك والخدمات المالية',
      price: 92.30,
      change: 2.80,
      changePct: 3.13,
      open: 89.50,
      high: 93.10,
      low: 89.20,
      prevClose: 89.50,
      volume: 123_456_789,
      tradedValue: 11_393_621_000,
      marketCap: 52_420_000_000,
      peRatio: 12.4,
      weekHigh52: 98.50,
      weekLow52: 67.30,
      lastUpdate: new Date().toISOString(),
      trend: 'up',
      trendExplanation: 'السهم فوق المتوسط المتحرك لـ 50 و200 يوم، والزخم إيجابي',
      perfOneMonth: 8.4,
      perfSixMonths: 23.7,
      ma50: 85.30,
      ma200: 78.50,
    },
    HRHO: {
      ticker: 'HRHO',
      companyName: 'EFG Hermes Holding',
      companyNameAr: 'هيرميس القابضة',
      sector: 'Financial Services',
      sectorAr: 'الخدمات المالية',
      price: 43.50,
      change: 0.90,
      changePct: 2.11,
      open: 42.60,
      high: 44.10,
      low: 42.40,
      prevClose: 42.60,
      volume: 98_765_432,
      tradedValue: 4_296_396_000,
      marketCap: 21_750_000_000,
      peRatio: 9.8,
      weekHigh52: 51.20,
      weekLow52: 32.10,
      lastUpdate: new Date().toISOString(),
      trend: 'sideways',
      trendExplanation: 'السهم يتداول في نطاق ضيق بين 40 و46 جنيهاً',
      perfOneMonth: -1.2,
      perfSixMonths: 15.3,
      ma50: 42.80,
      ma200: 40.10,
    },
    ETEL: {
      ticker: 'ETEL',
      companyName: 'Telecom Egypt',
      companyNameAr: 'المصرية للاتصالات',
      sector: 'Telecommunications',
      sectorAr: 'الاتصالات والتكنولوجيا',
      price: 17.85,
      change: -0.25,
      changePct: -1.38,
      open: 18.10,
      high: 18.25,
      low: 17.70,
      prevClose: 18.10,
      volume: 87_654_321,
      tradedValue: 1_564_630_000,
      marketCap: 17_320_000_000,
      peRatio: 7.2,
      weekHigh52: 23.40,
      weekLow52: 15.60,
      lastUpdate: new Date().toISOString(),
      trend: 'down',
      trendExplanation: 'السهم دون المتوسط المتحرك لـ 50 يوم والميل الحالي هبوطي',
      perfOneMonth: -4.8,
      perfSixMonths: -12.6,
      ma50: 18.90,
      ma200: 20.30,
    },
  };
  if (stocks[ticker.toUpperCase()]) return stocks[ticker.toUpperCase()];
  // Generic fallback for unknown tickers
  return {
    ticker: ticker.toUpperCase(),
    companyName: `${ticker} Company`,
    companyNameAr: `شركة ${ticker}`,
    sector: 'Mixed',
    sectorAr: 'متنوع',
    price: 25.40 + Math.random() * 50,
    change: (Math.random() - 0.5) * 4,
    changePct: (Math.random() - 0.5) * 8,
    open: 24.00,
    high: 27.00,
    low: 23.50,
    prevClose: 24.50,
    volume: 5_000_000,
    tradedValue: 127_000_000,
    marketCap: 5_000_000_000,
    weekHigh52: 35.00,
    weekLow52: 18.00,
    lastUpdate: new Date().toISOString(),
    trend: 'sideways',
    trendExplanation: 'بيانات تجريبية',
    perfOneMonth: (Math.random() - 0.5) * 10,
    perfSixMonths: (Math.random() - 0.5) * 25,
    ma50: 24.50,
    ma200: 23.00,
  };
}

// ── Stock Price History ───────────────────────────────────────────────────────
export function getMockPriceHistory(ticker: string, range: string): PricePoint[] {
  const days = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 365;
  const quote = getMockStockQuote(ticker);
  const points: PricePoint[] = [];
  let price = quote.price * (1 - 0.15);
  const ma50Arr: number[] = [];
  const ma200Arr: number[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 5 || date.getDay() === 6) continue;
    price += price * (Math.random() - 0.47) * 0.025;
    price = Math.max(price, quote.price * 0.5);
    ma50Arr.push(price);
    ma200Arr.push(price);
    const ma50 = ma50Arr.length >= 50 ? ma50Arr.slice(-50).reduce((a, b) => a + b, 0) / 50 : undefined;
    const ma200 = ma200Arr.length >= 200 ? ma200Arr.slice(-200).reduce((a, b) => a + b, 0) / 200 : undefined;
    points.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 10_000_000 + 1_000_000),
      ma50,
      ma200,
    });
  }
  return points;
}

// ── Ownership ─────────────────────────────────────────────────────────────────
export const MOCK_OWNERSHIP: OwnershipItem[] = [
  { label: 'المساهم المؤسس', percentage: 31.2, color: '#059669', isMock: true },
  { label: 'المؤسسات', percentage: 28.4, color: '#0891b2', isMock: true },
  { label: 'الأجانب', percentage: 18.7, color: '#7c3aed', isMock: true },
  { label: 'التداول الحر', percentage: 21.7, color: '#d97706', isMock: true },
];

// ── Liquidity ─────────────────────────────────────────────────────────────────
export function getMockLiquidity(ticker: string): LiquidityDay[] {
  const days: LiquidityDay[] = [];
  const now = new Date();
  let day = 0;
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 5 || date.getDay() === 6) continue;
    if (day >= 14) break;
    const buyValue = Math.floor(Math.random() * 200_000_000 + 50_000_000);
    const sellValue = Math.floor(Math.random() * 200_000_000 + 50_000_000);
    days.push({
      date: date.toISOString().split('T')[0],
      netFlow: buyValue - sellValue,
      buyValue,
      sellValue,
      volume: Math.floor(Math.random() * 20_000_000 + 5_000_000),
      isMock: true,
    });
    day++;
  }
  return days;
}

// ── Financials ────────────────────────────────────────────────────────────────
export function getMockFinancials(ticker: string, type: 'annual' | 'quarterly'): FinancialPeriod[] {
  if (type === 'annual') {
    return [
      { period: '2020', type: 'annual', revenue: 8_450_000_000, netProfit: 2_100_000_000, isMock: true },
      { period: '2021', type: 'annual', revenue: 9_820_000_000, netProfit: 2_650_000_000, revenueGrowth: 16.2, profitGrowth: 26.2, isMock: true },
      { period: '2022', type: 'annual', revenue: 12_340_000_000, netProfit: 3_410_000_000, revenueGrowth: 25.7, profitGrowth: 28.7, isMock: true },
      { period: '2023', type: 'annual', revenue: 16_780_000_000, netProfit: 4_920_000_000, revenueGrowth: 36.0, profitGrowth: 44.3, isMock: true },
      { period: '2024', type: 'annual', revenue: 21_450_000_000, netProfit: 6_240_000_000, revenueGrowth: 27.8, profitGrowth: 26.8, isMock: true },
    ];
  }
  return [
    { period: 'Q1 2024', type: 'quarterly', revenue: 4_800_000_000, netProfit: 1_350_000_000, isMock: true },
    { period: 'Q2 2024', type: 'quarterly', revenue: 5_100_000_000, netProfit: 1_480_000_000, revenueGrowth: 6.3, profitGrowth: 9.6, isMock: true },
    { period: 'Q3 2024', type: 'quarterly', revenue: 5_450_000_000, netProfit: 1_620_000_000, revenueGrowth: 6.9, profitGrowth: 9.5, isMock: true },
    { period: 'Q4 2024', type: 'quarterly', revenue: 6_100_000_000, netProfit: 1_790_000_000, revenueGrowth: 11.9, profitGrowth: 10.5, isMock: true },
    { period: 'Q1 2025', type: 'quarterly', revenue: 5_900_000_000, netProfit: 1_720_000_000, revenueGrowth: -3.3, profitGrowth: -3.9, isMock: true },
  ];
}
