/**
 * marketApi.ts — Data layer for سهمي
 *
 * Tries to fetch from the local proxy server (which uses Playwright to scrape egx.com.eg).
 * If the proxy is unavailable or returns { fallbackToMock: true }, falls back to mock data
 * and marks data as isMock=true so the UI can show "بيانات تجريبية" badges.
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

import {
  MOCK_INDICES,
  MOCK_INDEX_HISTORY,
  MOCK_SECTORS,
  MOCK_NEWS,
  MOCK_TOP_GAINERS,
  MOCK_TOP_LOSERS,
  MOCK_MOST_ACTIVE,
  MOCK_SEARCH_SUGGESTIONS,
  MOCK_OWNERSHIP,
  getMockStockQuote,
  getMockPriceHistory,
  getMockLiquidity,
  getMockFinancials,
} from '../mocks';

// ─── Config ───────────────────────────────────────────────────────────────────
// In dev: Vite proxies /api → localhost:3001 (no CORS)
// In prod: set VITE_PROXY_BASE to your deployed server URL
const PROXY_BASE = import.meta.env.VITE_PROXY_BASE ?? '';
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Core fetch helper ────────────────────────────────────────────────────────
async function proxyFetch<T>(path: string, fallback: T): Promise<{ data: T; isReal: boolean }> {
  if (FORCE_MOCK) return { data: fallback, isReal: false };

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${PROXY_BASE}${path}`, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });
    clearTimeout(tid);

    const json = await res.json();

    // Proxy signals fallback needed
    if (!res.ok || json?.fallbackToMock || json?.error) {
      console.warn(`[marketApi] Proxy fallback for ${path}:`, json?.error ?? res.status);
      return { data: fallback, isReal: false };
    }

    // Got real data
    return { data: json as T, isReal: true };
  } catch (err) {
    // Proxy not running or network error — silent fallback
    if (!(err instanceof Error && err.name === 'AbortError')) {
      console.warn(`[marketApi] Proxy unavailable for ${path}, using mock data`);
    }
    return { data: fallback, isReal: false };
  }
}

// ─── Public API functions ─────────────────────────────────────────────────────

export async function fetchIndices(): Promise<IndexSnapshot[]> {
  const { data, isReal } = await proxyFetch<IndexSnapshot[]>('/api/indices', MOCK_INDICES);
  // Mark mock data
  return data.map(idx => ({ ...idx, isMock: !isReal }));
}

export async function fetchIndexHistory(range: string): Promise<IndexHistoryPoint[]> {
  const fallback = MOCK_INDEX_HISTORY[range] ?? MOCK_INDEX_HISTORY['1M'];
  const { data } = await proxyFetch<IndexHistoryPoint[]>(`/api/index-history?range=${range}`, fallback);
  return data;
}

export async function fetchSectors(): Promise<Sector[]> {
  const { data, isReal } = await proxyFetch<Sector[]>('/api/sectors', MOCK_SECTORS);
  return data.map(s => ({ ...s, isMock: !isReal }));
}

export async function fetchNews(): Promise<NewsItem[]> {
  const { data, isReal } = await proxyFetch<NewsItem[]>('/api/news', MOCK_NEWS);
  return data.map(n => ({ ...n, isMock: !isReal }));
}

export async function fetchTopGainers(): Promise<StockMover[]> {
  const { data } = await proxyFetch<StockMover[]>('/api/top-gainers', MOCK_TOP_GAINERS);
  return data;
}

export async function fetchTopLosers(): Promise<StockMover[]> {
  const { data } = await proxyFetch<StockMover[]>('/api/top-losers', MOCK_TOP_LOSERS);
  return data;
}

export async function fetchMostActive(): Promise<StockMover[]> {
  const { data } = await proxyFetch<StockMover[]>('/api/most-active', MOCK_MOST_ACTIVE);
  return data;
}

export async function fetchUndervalued(): Promise<UndervaluedStock[]> {
  // Use a fallback mock array if the server call fails
  const { data } = await proxyFetch<UndervaluedStock[]>('/api/undervalued', []);
  return data;
}

export async function fetchStockQuote(ticker: string): Promise<StockQuote | null> {
  if (!ticker) return null;
  const { data, isReal } = await proxyFetch<StockQuote>(
    `/api/stock/${ticker}`,
    getMockStockQuote(ticker)
  );
  return { ...data, isMock: !isReal } as StockQuote;
}

export async function fetchStockPriceHistory(ticker: string, range: string): Promise<PricePoint[]> {
  const { data } = await proxyFetch<PricePoint[]>(
    `/api/stock/${ticker}/history?range=${range}`,
    getMockPriceHistory(ticker, range)
  );
  return data;
}

export async function fetchOwnership(ticker: string): Promise<OwnershipItem[]> {
  // Ownership data is not available on egx.com.eg — always mock
  return MOCK_OWNERSHIP.map(o => ({ ...o, isMock: true }));
}

export async function fetchLiquidity(ticker: string): Promise<LiquidityDay[]> {
  // Liquidity detail is not available on egx.com.eg — always mock
  return getMockLiquidity(ticker).map(d => ({ ...d, isMock: true }));
}

export async function fetchFinancials(ticker: string, type: 'annual' | 'quarterly'): Promise<FinancialPeriod[]> {
  // Financial statements not available as API on egx.com.eg — always mock
  return getMockFinancials(ticker, type).map(f => ({ ...f, isMock: true }));
}

export async function fetchSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MOCK_SEARCH_SUGGESTIONS.filter(
    s =>
      s.ticker.toLowerCase().includes(q) ||
      s.companyNameAr.includes(q)
  );
}
