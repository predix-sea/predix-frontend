import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  ACTIVITY_FEED_ANCHOR_MS,
  formatRelativeTime,
  generateActivityFeed,
} from '@/lib/mockActivityFeed';
import type { Market } from '@/types';

const sampleMarket: Market = {
  id: 'm1',
  title: 'Test market',
  status: 'OPEN',
  outcomes: [{ id: 'yes', label: 'Yes', probability: 0.6 }],
  volume: 1000,
  category: 'politics',
  closesAt: '2026-12-31T00:00:00.000Z',
};

describe('mockActivityFeed SSR stability', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('generateActivityFeed is deterministic with anchor nowMs', () => {
    const a = generateActivityFeed([sampleMarket], 1, ACTIVITY_FEED_ANCHOR_MS);
    const b = generateActivityFeed([sampleMarket], 1, ACTIVITY_FEED_ANCHOR_MS);
    expect(a).toEqual(b);
    expect(a[0]?.timestamp).toBeLessThan(ACTIVITY_FEED_ANCHOR_MS);
  });

  it('formatRelativeTime is deterministic when nowMs is fixed', () => {
    const timestamp = ACTIVITY_FEED_ANCHOR_MS - 7 * 60_000;
    expect(formatRelativeTime(timestamp, ACTIVITY_FEED_ANCHOR_MS)).toBe('7m');
  });

  it('generateActivityFeed supports count up to 12', () => {
    const markets = Array.from({ length: 15 }, (_, i) => ({
      ...sampleMarket,
      id: `m${i}`,
      title: `Market ${i}`,
    }));
    const feed = generateActivityFeed(markets, 12, ACTIVITY_FEED_ANCHOR_MS);
    expect(feed).toHaveLength(12);
  });
});
