/**
 * marketApi.ts — Data layer for سهمي
 *
 * Fetches exclusively from the local proxy server (Investing.com Playwright scraper).
 * NO MOCK DATA. NO FALLBACKS.
 */

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
  UndervaluedStock,
} from '../types';

const PROXY_BASE = import.meta.env.VITE_PROXY_BASE ?? '';

// ─── Core fetch helper ────────────────────────────────────────────────────────
async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PROXY_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return await res.json();
}

// ─── Public API functions ─────────────────────────────────────────────────────

export async function fetchIndices(): Promise<IndexSnapshot[]> {
  const data = await proxyFetch<IndexSnapshot[]>('/api/indices');
  return data || [];
}

export async function fetchTopGainers(): Promise<StockMover[]> {
  const data = await proxyFetch<StockMover[]>('/api/top-gainers');
  return data || [];
}

export async function fetchTopLosers(): Promise<StockMover[]> {
  const data = await proxyFetch<StockMover[]>('/api/top-losers');
  return data || [];
}

export async function fetchMostActive(): Promise<StockMover[]> {
  const data = await proxyFetch<StockMover[]>('/api/most-active');
  return data || [];
}

export async function fetchStockQuote(ticker: string): Promise<StockQuote | null> {
  if (!ticker) return null;
  const data = await proxyFetch<StockQuote>(`/api/stock/${ticker}`);
  return data || null;
}

// Unsupported features via Investing.com simple scrape (return empty)
export async function fetchUndervalued(): Promise<UndervaluedStock[]> { return []; }
export async function fetchIndexHistory(range: string): Promise<IndexHistoryPoint[]> { return []; }
export async function fetchSectors(): Promise<Sector[]> { return []; }
export async function fetchNews(): Promise<NewsItem[]> { return []; }
export async function fetchStockPriceHistory(ticker: string, range: string): Promise<PricePoint[]> { return []; }
export async function fetchOwnership(ticker: string): Promise<OwnershipItem[]> { return []; }
export async function fetchLiquidity(ticker: string): Promise<LiquidityDay[]> { return []; }
export async function fetchFinancials(ticker: string, type: 'annual' | 'quarterly'): Promise<FinancialPeriod[]> { return []; }
export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[]> { return []; }
