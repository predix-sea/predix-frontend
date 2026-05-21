'use client';

import { useParams } from 'next/navigation';
import { MarketStatusBadge } from '@/components/markets/MarketStatusBadge';
import { OrderBookPanel } from '@/components/trading/OrderBookPanel';
import { OrderForm } from '@/components/trading/OrderForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useMarket, useOrderBook } from '@/hooks/useMarkets';
import { formatCountdown, formatUsd } from '@/lib/format';

export default function MarketDetailPage() {
  const params = useParams();
  const marketId = String(params.marketId ?? '');

  const { data: market, isLoading, error } = useMarket(marketId);
  const { data: orderbook, isLoading: obLoading } = useOrderBook(marketId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !market) {
    return <p className="py-12 text-center text-predix-danger">Market not found</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{market.title}</h1>
          <MarketStatusBadge status={market.status} />
        </div>
        {market.description && (
          <p className="mb-4 text-predix-muted">{market.description}</p>
        )}
        <div className="mb-6 flex gap-6 text-sm text-predix-muted">
          <span>Volume {formatUsd(market.volume)}</span>
          <span>Closes {formatCountdown(market.closesAt)}</span>
        </div>
        <OrderBookPanel orderbook={orderbook} isLoading={obLoading} />
      </div>
      <div>
        <OrderForm market={market} />
      </div>
    </div>
  );
}
