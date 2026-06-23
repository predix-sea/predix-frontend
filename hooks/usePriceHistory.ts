'use client';

import { useQuery } from '@tanstack/react-query';
import { marketService } from '@/services/marketService';
import type { CandleInterval, ChartOutcome, ChartRange } from '@/types';

export function usePriceHistory(
  marketId: string,
  params: { interval: CandleInterval; outcome: ChartOutcome; range: ChartRange },
) {
  return useQuery({
    queryKey: ['priceHistory', marketId, params],
    queryFn: () => marketService.priceHistory(marketId, params),
    enabled: !!marketId,
    staleTime: 60_000,
  });
}
