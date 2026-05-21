'use client';

import { useMemo } from 'react';
import { MarketCard } from '@/components/markets/MarketCard';
import { MarketFilters } from '@/components/markets/MarketFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useMarkets } from '@/hooks/useMarkets';
import { useMarketFilterStore } from '@/stores/marketFilterStore';

export default function MarketsPage() {
  const { status, category, query } = useMarketFilterStore();
  const filters = useMemo(
    () => ({
      status: status || undefined,
      category: category || undefined,
      q: query || undefined,
    }),
    [status, category, query],
  );

  const { data: markets, isLoading, error } = useMarkets(filters);

  const filtered = useMemo(() => {
    if (!markets) return [];
    if (!query) return markets;
    const q = query.toLowerCase();
    return markets.filter((m) => m.title.toLowerCase().includes(q));
  }, [markets, query]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="mt-1 text-predix-muted">Trade on real-world outcomes across Southeast Asia</p>
      </div>

      <MarketFilters />

      {isLoading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="py-12 text-center text-predix-danger">
          Failed to load markets. Ensure BFF is running.
        </p>
      )}

      {!isLoading && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
          {!filtered.length && (
            <p className="col-span-full py-12 text-center text-predix-muted">No markets found</p>
          )}
        </div>
      )}
    </div>
  );
}
