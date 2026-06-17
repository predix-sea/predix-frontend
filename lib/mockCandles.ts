import type { Candle, CandleInterval, ChartOutcome } from '@/types';

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (const ch of seed) hash = (Math.imul(31, hash) + ch.charCodeAt(0)) | 0;
  return () => {
    hash = Math.imul(hash ^ (hash >>> 15), hash | 1);
    hash ^= hash + Math.imul(hash ^ (hash >>> 7), hash | 61);
    return ((hash ^ (hash >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function intervalSeconds(interval: CandleInterval): number {
  return interval === '1h' ? 3600 : 86_400;
}

function clampPrice(price: number): number {
  return Math.min(0.95, Math.max(0.05, price));
}

function toOutcomeCandle(
  time: number,
  yesOpen: number,
  yesHigh: number,
  yesLow: number,
  yesClose: number,
  volume: number,
  outcome: ChartOutcome,
): Candle {
  if (outcome === 'YES') {
    return { time, open: yesOpen, high: yesHigh, low: yesLow, close: yesClose, volume };
  }
  return {
    time,
    open: 1 - yesOpen,
    high: 1 - yesLow,
    low: 1 - yesHigh,
    close: 1 - yesClose,
    volume,
  };
}

export function generateMockCandles(
  marketId: string,
  params: { interval: CandleInterval; outcome: ChartOutcome },
): Candle[] {
  const rand = seededRandom(`${marketId}:${params.interval}`);
  const step = intervalSeconds(params.interval);
  const count = params.interval === '1h' ? 30 * 24 : 30;
  const now = Math.floor(Date.now() / 1000);
  const start = now - count * step;

  let price = clampPrice(0.42 + rand() * 0.2);
  const candles: Candle[] = [];

  for (let i = 0; i < count; i++) {
    const time = start + i * step;
    const open = price;
    const close = clampPrice(open + (rand() - 0.48) * 0.03);
    const wick = rand() * 0.02;
    const high = Math.min(0.99, Math.max(open, close) + wick);
    const low = Math.max(0.01, Math.min(open, close) - wick);
    const volume = Math.round(200 + rand() * 1800);

    candles.push(toOutcomeCandle(time, open, high, low, close, volume, params.outcome));
    price = close;
  }

  return candles;
}
