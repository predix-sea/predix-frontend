'use client';

import { MarketStatusBadge } from '@/components/markets/MarketStatusBadge';
import { getCategoryMeta } from '@/lib/marketCategories';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { formatCountdown, formatUsd } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';
import type { Market } from '@/types';

export function MarketDetailHeader({ market }: { market: Market }) {
  const { t } = useTranslation();
  const { labelKey, color } = getCategoryMeta(market.category);
  const categoryLabel = labelKey ? t(labelKey) : market.category;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start gap-3">
        <h1 className="flex-1 text-xl font-bold leading-snug text-text-primary lg:text-2xl">
          {market.title}
        </h1>
        <MarketStatusBadge status={market.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {market.category && categoryLabel && (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ color, backgroundColor: `${color}18` }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            {categoryLabel}
          </span>
        )}
        <span className="text-sm text-text-secondary">
          {t('trading.volume')}{' '}
          <span className="font-medium text-text-primary">{formatUsd(market.volume)}</span>
        </span>
        <span className="text-sm text-text-secondary">
          {t('trading.ends')}{' '}
          <ClientLiveText className="font-medium text-text-primary">
            {() => formatCountdown(market.closesAt)}
          </ClientLiveText>
        </span>
      </div>

      {market.description && (
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{market.description}</p>
      )}
    </div>
  );
}
