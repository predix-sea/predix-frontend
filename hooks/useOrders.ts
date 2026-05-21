'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { mapApiError } from '@/services/bffClient';
import { trackEvent } from '@/lib/analytics';
import type { PlaceOrderRequest } from '@/types';

export function useOrders() {
  const pollMs = Number(process.env.NEXT_PUBLIC_ORDERS_POLL_MS ?? 8000);
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list(),
    refetchInterval: pollMs,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: PlaceOrderRequest) => orderService.place(req),
    onSuccess: () => {
      trackEvent('order_submit_success');
      void qc.invalidateQueries({ queryKey: ['orders'] });
      void qc.invalidateQueries({ queryKey: ['orderbook'] });
    },
    onError: (err) => {
      const apiErr = mapApiError(err);
      trackEvent('order_submit_failed', { code: apiErr.code });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderService.cancel(orderId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
