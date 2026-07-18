'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MarketDetailHeader } from '@/components/trading/MarketDetailHeader';
import { MarketMainPanel } from '@/components/trading/MarketMainPanel';
import { TradingPanel } from '@/components/trading/TradingPanel';
import { CtfPositionsPanel } from '@/components/portfolio/CtfPositionsPanel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useMarket, useOrderBook } from '@/hooks/useMarkets';
import { useTranslation } from '@/hooks/useTranslation';
import { getYesOutcomeId } from '@/lib/marketPricing';

export default function MarketDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const marketId = String(params.marketId ?? '');

  const { data: market, isLoading, error } = useMarket(marketId);
  const {
    data: orderbook,
    isLoading: obLoading,
    isError: obError,
    error: obErrorDetail,
  } = useOrderBook(marketId);

  const [selectedOutcomeId, setSelectedOutcomeId] = useState('');

  useEffect(() => {
    if (market) {
      setSelectedOutcomeId(getYesOutcomeId(market) ?? market.outcomes[0]?.id ?? '');
    }
  }, [market?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !market) {
    return <p className="py-12 text-center text-no">{t('trading.marketNotFound')}</p>;
  }

  const activeOutcomeId = selectedOutcomeId || getYesOutcomeId(market) || market.outcomes[0]?.id || '';

  return (
    <div className="pb-36 lg:pb-0">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          <MarketDetailHeader market={market} />
          <div className="mb-4">
            <CtfPositionsPanel conditionId={market.conditionId} marketId={market.id} />
          </div>
          <MarketMainPanel
            market={market}
            orderbook={orderbook}
            isLoading={obLoading}
            isError={obError}
            error={obErrorDetail}
          />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto border-t border-border bg-card p-3 shadow-[0_-4px_24px_rgb(0_0_0_/0.08)] lg:static lg:z-auto lg:max-h-none lg:overflow-visible lg:border-t-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <div className="lg:sticky lg:top-[4.5rem]">
            <TradingPanel
              market={market}
              orderbook={orderbook}
              selectedOutcomeId={activeOutcomeId}
              onOutcomeChange={setSelectedOutcomeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
