import { useQuery } from '@tanstack/react-query';
import {
  fetchStockQuote,
  fetchStockPriceHistory,
  fetchOwnership,
  fetchLiquidity,
  fetchFinancials,
} from '../services/marketApi';

export function useStockQuote(ticker: string) {
  return useQuery({
    queryKey: ['stockQuote', ticker],
    queryFn: () => fetchStockQuote(ticker),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStockPriceHistory(ticker: string, range: string) {
  return useQuery({
    queryKey: ['stockHistory', ticker, range],
    queryFn: () => fetchStockPriceHistory(ticker, range),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOwnership(ticker: string) {
  return useQuery({
    queryKey: ['ownership', ticker],
    queryFn: () => fetchOwnership(ticker),
    enabled: !!ticker,
    staleTime: 30 * 60 * 1000,
  });
}

export function useLiquidity(ticker: string) {
  return useQuery({
    queryKey: ['liquidity', ticker],
    queryFn: () => fetchLiquidity(ticker),
    enabled: !!ticker,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFinancials(ticker: string, type: 'annual' | 'quarterly') {
  return useQuery({
    queryKey: ['financials', ticker, type],
    queryFn: () => fetchFinancials(ticker, type),
    enabled: !!ticker,
    staleTime: 60 * 60 * 1000,
  });
}
