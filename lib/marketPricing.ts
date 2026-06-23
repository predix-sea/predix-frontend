import type { Market, OrderBook } from '@/types';

export function formatCents(price: number | undefined): string {
  if (price === undefined || Number.isNaN(price)) return '—';
  return `${(price * 100).toFixed(0)}¢`;
}

export function formatCentsPrecise(price: number | undefined): string {
  if (price === undefined || Number.isNaN(price)) return '—';
  return `${(price * 100).toFixed(1)}¢`;
}

function findYesOutcome(market: Market) {
  return market.outcomes.find((o) => o.label.toLowerCase() === 'yes');
}

function findNoOutcome(market: Market) {
  return market.outcomes.find((o) => o.label.toLowerCase() === 'no');
}

export function getYesPrice(market: Market, orderbook?: OrderBook): number | undefined {
  const yes = findYesOutcome(market);

  if (orderbook?.lastTradePrice !== undefined) return orderbook.lastTradePrice;
  if (yes?.price !== undefined) return yes.price;
  if (yes?.probability !== undefined) return yes.probability;

  const bestBid = orderbook?.bids?.[0]?.price;
  const bestAsk = orderbook?.asks?.[0]?.price;
  if (bestBid !== undefined && bestAsk !== undefined) return (bestBid + bestAsk) / 2;
  if (bestBid !== undefined) return bestBid;
  if (bestAsk !== undefined) return bestAsk;

  return yes ? 0.5 : undefined;
}

export function getNoPrice(market: Market, orderbook?: OrderBook): number | undefined {
  const no = findNoOutcome(market);
  const yesPrice = getYesPrice(market, orderbook);

  if (no?.price !== undefined) return no.price;
  if (no?.probability !== undefined) return no.probability;
  if (yesPrice !== undefined) return 1 - yesPrice;

  return no ? 0.5 : undefined;
}

export function getYesOutcomeId(market: Market): string | undefined {
  return findYesOutcome(market)?.id;
}

export function getNoOutcomeId(market: Market): string | undefined {
  return findNoOutcome(market)?.id;
}
