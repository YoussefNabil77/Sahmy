import { useQuery } from '@tanstack/react-query';
import {
  fetchIndices,
  fetchIndexHistory,
  fetchSectors,
  fetchNews,
  fetchTopGainers,
  fetchTopLosers,
  fetchMostActive,
} from '../services/marketApi';

export function useIndices() {
  return useQuery({
    queryKey: ['indices'],
    queryFn: fetchIndices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIndexHistory(range: string) {
  return useQuery({
    queryKey: ['indexHistory', range],
    queryFn: () => fetchIndexHistory(range),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSectors() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: fetchSectors,
    staleTime: 5 * 60 * 1000,
  });
}

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTopGainers() {
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: fetchTopGainers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopLosers() {
  return useQuery({
    queryKey: ['topLosers'],
    queryFn: fetchTopLosers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMostActive() {
  return useQuery({
    queryKey: ['mostActive'],
    queryFn: fetchMostActive,
    staleTime: 5 * 60 * 1000,
  });
}
