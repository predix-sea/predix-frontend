import { bffRequest } from './bffClient';
import type { Order, PlaceOrderRequest } from '@/types';

function normalizeOrder(raw: Record<string, unknown>): Order {
  return {
    id: String(raw.id ?? ''),
    marketId: String(raw.marketId ?? ''),
    outcomeId: String(raw.outcomeId ?? ''),
    side: (raw.side as Order['side']) ?? 'BUY',
    type: (raw.type as Order['type']) ?? 'LIMIT',
    price: raw.price !== undefined ? Number(raw.price) : undefined,
    size: Number(raw.size ?? 0),
    filledSize: raw.filledSize !== undefined ? Number(raw.filledSize) : undefined,
    status: String(raw.status ?? 'PENDING'),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

export const orderService = {
  place: async (request: PlaceOrderRequest) => {
    const data = await bffRequest<Record<string, unknown>>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return normalizeOrder(data);
  },

  cancel: async (orderId: string) => {
    const data = await bffRequest<Record<string, unknown>>(
      `/api/v1/orders/${orderId}/cancel`,
      { method: 'POST', body: JSON.stringify({}) },
    );
    return normalizeOrder(data);
  },

  /** Aggregated from matching engine via BFF — list via markets user orders if BFF adds route; placeholder uses empty until endpoint exists */
  list: async (): Promise<Order[]> => {
    try {
      const data = await bffRequest<Record<string, unknown>[]>('/api/v1/orders');
      return (data ?? []).map(normalizeOrder);
    } catch {
      return [];
    }
  },
};
