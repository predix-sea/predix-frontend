'use client';

import { useQuery } from '@tanstack/react-query';
import { marketService } from '@/services/marketService';

export function useMarkets(filters?: { status?: string; category?: string; q?: string }) {
  return useQuery({
    queryKey: ['markets', filters],
    queryFn: () => marketService.list(filters),
    staleTime: 30_000,
  });
}

export function useMarket(marketId: string) {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: () => marketService.get(marketId),
    enabled: !!marketId,
  });
}

export function useOrderBook(marketId: string) {
  const pollMs = Number(process.env.NEXT_PUBLIC_ORDERBOOK_POLL_MS ?? 5000);
  return useQuery({
    queryKey: ['orderbook', marketId],
    queryFn: () => marketService.orderbook(marketId),
    enabled: !!marketId,
    refetchInterval: pollMs,
  });
}
