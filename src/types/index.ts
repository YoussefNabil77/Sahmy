export interface IndexSnapshot {
  name: string;
  nameEn: string;
  value: number;
  change: number;
  changePct: number;
  volume: number;
  tradedValue: number;
  advancing: number;
  declining: number;
  unchanged: number;
  lastUpdate: string;
  sparkline: number[];
}

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: string;
  lastUpdate: string;
}

export interface IndexHistoryPoint {
  date: string;
  value: number;
  volume?: number;
}

export interface Sector {
  id: string;
  name: string;
  changePct: number;
  tradedValue: number;
  volume: number;
  stockCount: number;
  color?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface StockMover {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  tradedValue: number;
}

export interface StockQuote {
  ticker: string;
  companyName: string;
  companyNameAr: string;
  sector: string;
  sectorAr: string;
  price: number;
  change: number;
  changePct: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  tradedValue: number;
  marketCap: number;
  peRatio?: number;
  weekHigh52: number;
  weekLow52: number;
  lastUpdate: string;
  trend: 'up' | 'down' | 'sideways';
  trendExplanation: string;
  perfOneMonth: number;
  perfSixMonths: number;
  ma50: number;
  ma200: number;
}

export interface PricePoint {
  date: string;
  price: number;
  volume?: number;
  ma50?: number;
  ma200?: number;
}

export interface OwnershipItem {
  label: string;
  percentage: number;
  color: string;
  isMock?: boolean;
}

export interface LiquidityDay {
  date: string;
  netFlow: number;
  buyValue: number;
  sellValue: number;
  volume: number;
  isMock?: boolean;
}

export interface FinancialPeriod {
  period: string;
  type: 'annual' | 'quarterly';
  revenue: number;
  netProfit: number;
  revenueGrowth?: number;
  profitGrowth?: number;
  isMock?: boolean;
}

export interface SearchSuggestion {
  ticker: string;
  companyNameAr: string;
  sector: string;
}
