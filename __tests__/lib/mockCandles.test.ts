import { describe, expect, it } from 'vitest';
import { filterCandlesByRange, rangeToInterval } from '@/lib/chartRange';
import { generateMockCandles } from '@/lib/mockCandles';

describe('mockCandles', () => {
  it('generates deterministic candles from marketId seed', () => {
    const a = generateMockCandles('market-a', { interval: '1d', outcome: 'YES' });
    const b = generateMockCandles('market-a', { interval: '1d', outcome: 'YES' });
    const c = generateMockCandles('market-b', { interval: '1d', outcome: 'YES' });

    expect(a).toHaveLength(30);
    expect(a[0].close).toBe(b[0].close);
    expect(a[0].close).not.toBe(c[0].close);
  });

  it('inverts prices for NO outcome', () => {
    const yes = generateMockCandles('m1', { interval: '1d', outcome: 'YES' });
    const no = generateMockCandles('m1', { interval: '1d', outcome: 'NO' });

    expect(no[10].close).toBeCloseTo(1 - yes[10].close, 5);
  });
});

describe('chartRange', () => {
  it('maps UI range to API interval', () => {
    expect(rangeToInterval('1H')).toBe('1h');
    expect(rangeToInterval('1D')).toBe('1h');
    expect(rangeToInterval('1W')).toBe('1d');
    expect(rangeToInterval('ALL')).toBe('1d');
  });

  it('filters candles by selected range', () => {
    const now = Math.floor(Date.now() / 1000);
    const candles = [
      { time: now - 7200 },
      { time: now - 1800 },
      { time: now - 300 },
    ];

    const filtered = filterCandlesByRange(
      candles as { time: number; open: number; high: number; low: number; close: number; volume: number }[],
      '1H',
    );

    expect(filtered).toHaveLength(2);
    expect(filtered.map((c) => c.time)).toEqual([now - 1800, now - 300]);
  });
});
