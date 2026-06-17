'use client';

import { MarketCard } from './MarketCard';
import { FeatureMarketCard } from './FeatureMarketCard';
import type { Market } from '@/types';

interface MarketGridProps {
  markets: Market[];
  loading?: boolean;
}

function MarketCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-lg bg-border" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-3 w-1/2 rounded bg-border" />
        </div>
      </div>
      <div className="mt-4 h-8 rounded-lg bg-border" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-border" />
        <div className="h-3 w-16 rounded bg-border" />
      </div>
    </div>
  );
}

export function MarketGrid({ markets, loading }: MarketGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MarketCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!markets.length) return null;

  const [featured, ...rest] = markets;

  return (
    <div className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {featured && <FeatureMarketCard market={featured} />}
      {rest.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
