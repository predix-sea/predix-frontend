'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MarketDetailHeader } from '@/components/trading/MarketDetailHeader';
import { MarketDetailTabs } from '@/components/trading/MarketDetailTabs';
import { ProbabilityHero } from '@/components/trading/ProbabilityHero';
import { OrderForm } from '@/components/trading/OrderForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useMarket, useOrderBook } from '@/hooks/useMarkets';
import { useTranslation } from '@/hooks/useTranslation';
import {
  formatCents,
  getNoOutcomeId,
  getNoPrice,
  getYesOutcomeId,
  getYesPrice,
} from '@/lib/marketPricing';
import { cn } from '@/lib/cn';

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

  const yesOutcomeId = getYesOutcomeId(market);
  const noOutcomeId = getNoOutcomeId(market);
  const yesPrice = getYesPrice(market, orderbook);
  const noPrice = getNoPrice(market, orderbook);
  const activeOutcomeId = selectedOutcomeId || yesOutcomeId || market.outcomes[0]?.id || '';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-4">
        <MarketDetailHeader market={market} />
        <ProbabilityHero market={market} orderbook={orderbook} />
        <MarketDetailTabs
          market={market}
          orderbook={orderbook}
          isLoading={obLoading}
          isError={obError}
          error={obErrorDetail}
        />
      </div>

      <div className="flex flex-col gap-3 lg:sticky lg:top-[4.5rem] lg:self-start">
        {yesOutcomeId && (
          <button
            type="button"
            onClick={() => setSelectedOutcomeId(yesOutcomeId)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition',
              activeOutcomeId === yesOutcomeId
                ? 'bg-yes ring-2 ring-yes/30 ring-offset-2 ring-offset-background'
                : 'bg-yes/90 hover:bg-yes',
            )}
          >
            <span>{t('trading.buyYes')}</span>
            <span className="font-mono">{formatCents(yesPrice)}</span>
          </button>
        )}
        {noOutcomeId && (
          <button
            type="button"
            onClick={() => setSelectedOutcomeId(noOutcomeId)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition',
              activeOutcomeId === noOutcomeId
                ? 'bg-no ring-2 ring-no/30 ring-offset-2 ring-offset-background'
                : 'bg-no/90 hover:bg-no',
            )}
          >
            <span>{t('trading.buyNo')}</span>
            <span className="font-mono">{formatCents(noPrice)}</span>
          </button>
        )}
        <OrderForm
          market={market}
          selectedOutcomeId={activeOutcomeId}
          onOutcomeChange={setSelectedOutcomeId}
        />
      </div>
    </div>
  );
}
