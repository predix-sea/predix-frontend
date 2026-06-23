'use client';

import { formatCents, getYesPrice } from '@/lib/marketPricing';
import { useTranslation } from '@/hooks/useTranslation';
import type { Market, OrderBook } from '@/types';
import { cn } from '@/lib/cn';

const MOCK_CHANGE_24H = 0.024;

interface ProbabilityHeroProps {
  market: Market;
  orderbook?: OrderBook;
}

export function ProbabilityHero({ market, orderbook }: ProbabilityHeroProps) {
  const { t } = useTranslation();
  const yesPrice = getYesPrice(market, orderbook);
  const change24h = MOCK_CHANGE_24H;
  const isPositive = change24h >= 0;

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 shadow-card">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t('trading.yes')}
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-yes lg:text-5xl">
            {formatCents(yesPrice)}
          </p>
        </div>
        <div className="mb-1">
          <p className="text-xs text-text-secondary">{t('trading.change24h')}</p>
          <p
            className={cn(
              'text-sm font-semibold tabular-nums',
              isPositive ? 'text-yes' : 'text-no',
            )}
          >
            {isPositive ? '+' : ''}
            {(change24h * 100).toFixed(1)}%
            <span className="ml-1.5 text-xs font-normal text-text-secondary">
              {t('trading.demo')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
