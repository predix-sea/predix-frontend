import { describe, expect, it } from 'vitest';
import {
  aggregateOrdersToOrderBook,
  buildSyntheticOrderBook,
  isOrderBookEmpty,
} from '@/lib/mockOrderBook';
import { buildOrderBookDepth } from '@/lib/orderBookDepth';
import type { Order } from '@/types';

describe('mockOrderBook', () => {
  it('aggregates open limit orders into bid/ask levels', () => {
    const orders: Order[] = [
      {
        id: '1',
        marketId: 'm1',
        outcomeId: 'yes',
        side: 'BUY',
        type: 'LIMIT',
        price: 0.6,
        size: 100,
        status: 'OPEN',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '2',
        marketId: 'm1',
        outcomeId: 'yes',
        side: 'BUY',
        type: 'LIMIT',
        price: 0.6,
        size: 50,
        status: 'OPEN',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '3',
        marketId: 'm1',
        outcomeId: 'yes',
        side: 'SELL',
        type: 'LIMIT',
        price: 0.65,
        size: 80,
        status: 'OPEN',
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: '4',
        marketId: 'm2',
        outcomeId: 'yes',
        side: 'BUY',
        type: 'LIMIT',
        price: 0.4,
        size: 20,
        status: 'OPEN',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];

    const book = aggregateOrdersToOrderBook(orders, 'm1');

    expect(book.bids).toEqual([{ price: 0.6, size: 150 }]);
    expect(book.asks).toEqual([{ price: 0.65, size: 80 }]);
    expect(book.isMock).toBe(true);
    expect(isOrderBookEmpty(book)).toBe(false);
  });

  it('builds synthetic order book for dev screenshots', () => {
    const book = buildSyntheticOrderBook('m1', 0.62);
    expect(book.bids.length).toBeGreaterThan(0);
    expect(book.asks.length).toBeGreaterThan(0);
    expect(book.lastTradePrice).toBe(0.62);
  });
});

describe('orderBookDepth', () => {
  it('computes spread and sorts asks above bids', () => {
    const depth = buildOrderBookDepth({
      marketId: 'm1',
      bids: [
        { price: 0.61, size: 100 },
        { price: 0.6, size: 80 },
      ],
      asks: [
        { price: 0.63, size: 90 },
        { price: 0.65, size: 70 },
      ],
    });

    expect(depth.bestBid).toBe(0.61);
    expect(depth.bestAsk).toBe(0.63);
    expect(depth.spread).toBeCloseTo(0.02);
    expect(depth.asks[0].price).toBe(0.65);
    expect(depth.bids[0].price).toBe(0.61);
  });
});
