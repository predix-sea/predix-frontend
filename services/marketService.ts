import { bffRequest } from './bffClient';
import type { Market, OrderBook, Position } from '@/types';

function normalizeMarket(raw: Record<string, unknown>): Market {
  const outcomesRaw = (raw.outcomes as Record<string, unknown>[] | undefined) ?? [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ];

  return {
    id: String(raw.id ?? raw.marketId ?? ''),
    title: String(raw.title ?? raw.name ?? 'Untitled Market'),
    description: raw.description ? String(raw.description) : undefined,
    category: raw.category ? String(raw.category) : undefined,
    status: String(raw.status ?? 'OPEN') as Market['status'],
    resolutionStatus: raw.resolutionStatus
      ? String(raw.resolutionStatus)
      : undefined,
    volume: Number(raw.volume ?? raw.totalVolume ?? 0),
    volume24h: raw.volume24h ? Number(raw.volume24h) : undefined,
    closesAt: raw.closesAt ? String(raw.closesAt) : raw.endTime ? String(raw.endTime) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    outcomes: outcomesRaw.map((o, i) => ({
      id: String(o.id ?? `outcome-${i}`),
      label: String(o.label ?? o.name ?? `Outcome ${i + 1}`),
      tokenId: o.tokenId ? String(o.tokenId) : undefined,
      price: o.price !== undefined ? Number(o.price) : undefined,
      probability: o.probability !== undefined ? Number(o.probability) : undefined,
    })),
    imageUrl: raw.imageUrl ? String(raw.imageUrl) : undefined,
  };
}

export const marketService = {
  list: async (params?: { status?: string; category?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set('status', params.status);
    if (params?.category) search.set('category', params.category);
    if (params?.q) search.set('q', params.q);
    const qs = search.toString();
    const data = await bffRequest<Record<string, unknown>[]>(
      `/api/v1/markets${qs ? `?${qs}` : ''}`,
    );
    return (data ?? []).map(normalizeMarket);
  },

  get: async (id: string) => {
    const data = await bffRequest<Record<string, unknown>>(`/api/v1/markets/${id}`);
    return normalizeMarket(data);
  },

  orderbook: async (id: string) => {
    const data = await bffRequest<Record<string, unknown>>(`/api/v1/markets/${id}/orderbook`);
    return {
      marketId: id,
      bids: ((data.bids as { price: number; size: number }[]) ?? []).map((b) => ({
        price: Number(b.price),
        size: Number(b.size),
      })),
      asks: ((data.asks as { price: number; size: number }[]) ?? []).map((a) => ({
        price: Number(a.price),
        size: Number(a.size),
      })),
      lastTradePrice: data.lastTradePrice ? Number(data.lastTradePrice) : undefined,
      updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    } satisfies OrderBook;
  },

  positions: async (marketId: string, userId: string) => {
    const data = await bffRequest<Record<string, unknown>[]>(
      `/api/v1/markets/${marketId}/positions?userId=${encodeURIComponent(userId)}`,
    );
    return (data ?? []).map(
      (p, i): Position => ({
        id: String(p.id ?? `pos-${i}`),
        marketId,
        outcomeId: String(p.outcomeId ?? ''),
        outcomeLabel: p.outcomeLabel ? String(p.outcomeLabel) : undefined,
        size: Number(p.size ?? 0),
        avgPrice: p.avgPrice !== undefined ? Number(p.avgPrice) : undefined,
        currentPrice: p.currentPrice !== undefined ? Number(p.currentPrice) : undefined,
        unrealizedPnl: p.unrealizedPnl !== undefined ? Number(p.unrealizedPnl) : undefined,
      }),
    );
  },
};
