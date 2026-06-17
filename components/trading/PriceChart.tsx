'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { filterCandlesByRange, rangeToInterval } from '@/lib/chartRange';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { ChartOutcome, ChartRange } from '@/types';

const PriceChartCanvas = dynamic(() => import('./PriceChartCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
});

const RANGES: ChartRange[] = ['1H', '1D', '1W', 'ALL'];
const OUTCOMES: ChartOutcome[] = ['YES', 'NO'];

interface PriceChartProps {
  marketId: string;
  currentPrice?: number;
}

export function PriceChart({ marketId, currentPrice }: PriceChartProps) {
  const { t } = useTranslation();
  const [range, setRange] = useState<ChartRange>('1W');
  const [outcome, setOutcome] = useState<ChartOutcome>('YES');
  const interval = rangeToInterval(range);

  const { data, isLoading, isError } = usePriceHistory(marketId, {
    interval,
    outcome,
    range,
  });

  const candles = useMemo(
    () => filterCandlesByRange(data?.candles ?? [], range),
    [data?.candles, range],
  );

  const displayPrice =
    currentPrice !== undefined
      ? outcome === 'NO'
        ? 1 - currentPrice
        : currentPrice
      : candles[candles.length - 1]?.close;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {OUTCOMES.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setOutcome(o)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition',
                outcome === o
                  ? o === 'YES'
                    ? 'bg-yes/15 text-yes'
                    : 'bg-no/15 text-no'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {o === 'YES' ? t('trading.yes') : t('trading.no')}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition',
                range === r
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#1e2a38] bg-[#0f1419]">
        {isLoading && (
          <div className="flex h-[280px] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex h-[280px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-text-secondary">{t('trading.unableLoadPriceHistory')}</p>
          </div>
        )}

        {!isLoading && !isError && candles.length === 0 && (
          <div className="flex h-[280px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-text-secondary">{t('trading.noPriceData')}</p>
          </div>
        )}

        {!isLoading && !isError && candles.length > 0 && (
          <div className="h-[280px]">
            <PriceChartCanvas
              candles={candles}
              currentPrice={displayPrice}
              outcome={outcome}
            />
          </div>
        )}
      </div>

      {data?.isMock && (
        <p className="mt-2 text-center text-xs text-text-secondary">
          {t('trading.demoPriceHistory')}
        </p>
      )}
    </div>
  );
}
