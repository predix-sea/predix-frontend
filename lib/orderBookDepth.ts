import type { OrderBook, OrderBookLevel } from '@/types';

export interface DepthRow {
  side: 'bid' | 'ask';
  price: number;
  size: number;
  total: number;
}

export interface OrderBookDepth {
  asks: DepthRow[];
  bids: DepthRow[];
  maxSize: number;
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
}

function toDepthRow(side: 'bid' | 'ask', level: OrderBookLevel): DepthRow {
  return {
    side,
    price: level.price,
    size: level.size,
    total: level.price * level.size,
  };
}

export function buildOrderBookDepth(orderbook: OrderBook): OrderBookDepth {
  const asks = [...orderbook.asks]
    .sort((a, b) => b.price - a.price)
    .map((level) => toDepthRow('ask', level));

  const bids = [...orderbook.bids]
    .sort((a, b) => b.price - a.price)
    .map((level) => toDepthRow('bid', level));

  const maxSize = Math.max(
    ...asks.map((r) => r.size),
    ...bids.map((r) => r.size),
    1,
  );

  const bestBid = bids.length ? Math.max(...bids.map((r) => r.price)) : undefined;
  const bestAsk = asks.length ? Math.min(...asks.map((r) => r.price)) : undefined;
  const spread =
    bestBid !== undefined && bestAsk !== undefined ? bestAsk - bestBid : undefined;

  return { asks, bids, maxSize, bestBid, bestAsk, spread };
}
