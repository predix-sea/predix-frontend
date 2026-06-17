import type { Candle, CandleInterval, ChartRange } from '@/types';

export function rangeToInterval(range: ChartRange): CandleInterval {
  return range === '1H' || range === '1D' ? '1h' : '1d';
}

export function filterCandlesByRange(candles: Candle[], range: ChartRange): Candle[] {
  const now = Math.floor(Date.now() / 1000);
  const seconds: Record<ChartRange, number> = {
    '1H': 3600,
    '1D': 86_400,
    '1W': 7 * 86_400,
    ALL: 30 * 86_400,
  };
  const cutoff = now - seconds[range];
  return candles.filter((c) => c.time >= cutoff);
}
