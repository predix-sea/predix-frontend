import type { ApiError, Order, OrderBook } from '@/types';

const MARKET_SCHEMA_BASE =
  process.env.NEXT_PUBLIC_MARKET_SCHEMA_URL ?? 'http://localhost:8081';

export function isMockOrderbookEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_ORDERBOOK === 'true';
}

export function isOrderBookEmpty(book: OrderBook): boolean {
  return book.bids.length === 0 && book.asks.length === 0;
}

export function shouldFallbackToMock(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const apiError = error as ApiError;
  return (
    apiError.status === 502 ||
    apiError.status === 503 ||
    apiError.code === 'DOWNSTREAM_UNAVAILABLE' ||
    apiError.code === 'DOWNSTREAM_TIMEOUT'
  );
}

function normalizeRawOrder(raw: Record<string, unknown>): Order {
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

const OPEN_STATUSES = new Set(['OPEN', 'PENDING', 'PARTIALLY_FILLED']);

export function aggregateOrdersToOrderBook(orders: Order[], marketId: string): OrderBook {
  const bidLevels = new Map<number, number>();
  const askLevels = new Map<number, number>();

  for (const order of orders) {
    if (order.marketId !== marketId) continue;
    if (!OPEN_STATUSES.has(order.status)) continue;
    if (order.type !== 'LIMIT' || order.price === undefined) continue;

    const remaining = order.size - (order.filledSize ?? 0);
    if (remaining <= 0) continue;

    const levels = order.side === 'BUY' ? bidLevels : askLevels;
    levels.set(order.price, (levels.get(order.price) ?? 0) + remaining);
  }

  const bids = [...bidLevels.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([price, size]) => ({ price, size }));

  const asks = [...askLevels.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([price, size]) => ({ price, size }));

  const lastTradePrice = bids[0] && asks[0] ? (bids[0].price + asks[0].price) / 2 : bids[0]?.price ?? asks[0]?.price;

  return {
    marketId,
    bids,
    asks,
    lastTradePrice,
    isMock: true,
    updatedAt: new Date().toISOString(),
  };
}

export function buildSyntheticOrderBook(marketId: string, midPrice = 0.55): OrderBook {
  const bids = Array.from({ length: 8 }, (_, i) => ({
    price: Math.round((midPrice - (i + 1) * 0.01) * 1000) / 1000,
    size: 60 + i * 25,
  })).filter((b) => b.price > 0.01);

  const asks = Array.from({ length: 8 }, (_, i) => ({
    price: Math.round((midPrice + (i + 1) * 0.01) * 1000) / 1000,
    size: 55 + i * 30,
  })).filter((a) => a.price < 0.99);

  return {
    marketId,
    bids,
    asks,
    lastTradePrice: midPrice,
    isMock: true,
    updatedAt: new Date().toISOString(),
  };
}

async function fetchMarketSchemaOrders(marketId: string): Promise<Order[]> {
  const url = `${MARKET_SCHEMA_BASE}/api/v1/orders?marketId=${encodeURIComponent(marketId)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Market schema orders failed (${response.status})`);
  }

  const body = await response.json();
  const rows: Record<string, unknown>[] = Array.isArray(body)
    ? body
    : Array.isArray((body as { data?: unknown }).data)
      ? ((body as { data: Record<string, unknown>[] }).data ?? [])
      : [];

  return rows.map(normalizeRawOrder);
}

export async function fetchMockOrderBook(marketId: string): Promise<OrderBook> {
  try {
    const orders = await fetchMarketSchemaOrders(marketId);
    const aggregated = aggregateOrdersToOrderBook(orders, marketId);
    if (!isOrderBookEmpty(aggregated)) return aggregated;
  } catch {
    // fall through to synthetic book for dev screenshots
  }

  return buildSyntheticOrderBook(marketId);
}
