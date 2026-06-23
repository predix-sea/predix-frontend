import { bffRequest } from './bffClient';
import {
  fetchMockOrderBook,
  isMockOrderbookEnabled,
  isOrderBookEmpty,
  shouldFallbackToMock,
} from '@/lib/mockOrderBook';
import { generateMockCandles } from '@/lib/mockCandles';
import type {
  Candle,
  CandleInterval,
  ChartOutcome,
  ChartRange,
  Market,
  OrderBook,
  Position,
  PriceHistory,
} from '@/types';

function normalizeCandle(raw: Record<string, unknown>): Candle {
  return {
    time: Number(raw.time),
    open: Number(raw.open),
    high: Number(raw.high),
    low: Number(raw.low),
    close: Number(raw.close),
    volume: Number(raw.volume ?? 0),
  };
}

function normalizeOrderBook(id: string, data: Record<string, unknown>): OrderBook {
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
  };
}

function normalizeMarket(raw: Record<string, unknown>): Market {
  const outcomesRaw = (raw.outcomes as Record<string, unknown>[] | undefined) ?? [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ];

  return {
    id: String(raw.id ?? raw.marketId ?? ''),
    title: String(raw.title ?? raw.name ?? 'Untitled Market'),
    description: raw.description ? String(raw.description) : undefined,
    category: raw.category ? String(raw.category).toLowerCase() : undefined,
    status: String(raw.status ?? 'OPEN') as Market['status'],
    resolutionStatus: raw.resolutionStatus
      ? String(raw.resolutionStatus)
      : undefined,
    volume: Number(raw.volume ?? raw.totalVolume ?? 0),
    volume24h: raw.volume24h ? Number(raw.volume24h) : undefined,
    closesAt: raw.closesAt
      ? String(raw.closesAt)
      : raw.closeTime
        ? String(raw.closeTime)
        : raw.endTime
          ? String(raw.endTime)
          : undefined,
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
    const useMock = isMockOrderbookEnabled();

    try {
      const data = await bffRequest<Record<string, unknown>>(`/api/v1/markets/${id}/orderbook`);
      const book = normalizeOrderBook(id, data);
      if (useMock && isOrderBookEmpty(book)) {
        return fetchMockOrderBook(id);
      }
      return book;
    } catch (error) {
      if (useMock && shouldFallbackToMock(error)) {
        return fetchMockOrderBook(id);
      }
      throw error;
    }
  },

  priceHistory: async (
    marketId: string,
    params: { interval: CandleInterval; outcome: ChartOutcome; range: ChartRange },
  ): Promise<PriceHistory> => {
    const search = new URLSearchParams({
      interval: params.interval,
      outcome: params.outcome,
    });

    try {
      const data = await bffRequest<Record<string, unknown>[]>(
        `/api/v1/markets/${marketId}/candles?${search.toString()}`,
      );
      const candles = (data ?? []).map(normalizeCandle);
      if (candles.length > 0) {
        return { candles };
      }
    } catch {
      // fall through to mock candles
    }

    return {
      candles: generateMockCandles(marketId, params),
      isMock: true,
    };
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
