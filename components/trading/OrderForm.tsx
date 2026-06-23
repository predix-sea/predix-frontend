'use client';

import { TradingPanel } from './TradingPanel';
import type { Market, OrderBook } from '@/types';

interface OrderFormProps {
  market: Market;
  orderbook?: OrderBook;
  selectedOutcomeId?: string;
  onOutcomeChange?: (id: string) => void;
}

/** @deprecated Use TradingPanel directly */
export function OrderForm({
  market,
  orderbook,
  selectedOutcomeId,
  onOutcomeChange,
}: OrderFormProps) {
  const outcomeId = selectedOutcomeId ?? market.outcomes[0]?.id ?? '';

  return (
    <TradingPanel
      market={market}
      orderbook={orderbook}
      selectedOutcomeId={outcomeId}
      onOutcomeChange={onOutcomeChange ?? (() => undefined)}
    />
  );
}
