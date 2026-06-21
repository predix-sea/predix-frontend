'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { filterCandlesByRange, rangeToInterval } from '@/lib/chartRange';
import { formatCentsPrecise } from '@/lib/marketPricing';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { ChartRange } from '@/types';

const PriceChartCanvas = dynamic(() => import('./PriceChartCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
});

const RANGES: ChartRange[] = ['1H', '1D', '1W', 'ALL'];
const MOCK_CHANGE_24H = 0.024;

interface PriceChartProps {
  marketId: string;
  currentPrice?: number;
}

export function PriceChart({ marketId, currentPrice }: PriceChartProps) {
  const { t } = useTranslation();
  const [range, setRange] = useState<ChartRange>('1W');
  const interval = rangeToInterval(range);

  const { data, isLoading, isError } = usePriceHistory(marketId, {
    interval,
    outcome: 'YES',
    range,
  });

  const candles = useMemo(
    () => filterCandlesByRange(data?.candles ?? [], range),
    [data?.candles, range],
  );

  const displayPrice = currentPrice ?? candles[candles.length - 1]?.close;
  const change24h = MOCK_CHANGE_24H;
  const isPositive = change24h >= 0;

  return (
    <div className="p-4 lg:px-5 lg:pt-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-3xl font-bold tabular-nums text-yes">
            {formatCentsPrecise(displayPrice)}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {t('trading.change24h')}{' '}
            <span className={cn('font-medium tabular-nums', isPositive ? 'text-yes' : 'text-no')}>
              {isPositive ? '+' : ''}
              {(change24h * 100).toFixed(1)}%
            </span>{' '}
            <span className="text-text-secondary/70">{t('trading.demo')}</span>
          </p>
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

      <div className="overflow-hidden rounded-lg border border-border bg-white">
        {isLoading && (
          <div className="flex h-[260px] items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex h-[260px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-text-secondary">{t('trading.unableLoadPriceHistory')}</p>
          </div>
        )}

        {!isLoading && !isError && candles.length === 0 && (
          <div className="flex h-[260px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-text-secondary">{t('trading.noPriceData')}</p>
          </div>
        )}

        {!isLoading && !isError && candles.length > 0 && (
          <div className="h-[260px]">
            <PriceChartCanvas candles={candles} currentPrice={displayPrice} outcome="YES" />
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
