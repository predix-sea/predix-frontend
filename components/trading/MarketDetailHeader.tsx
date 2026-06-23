'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MarketStatusBadge } from '@/components/markets/MarketStatusBadge';
import { getCategoryMeta } from '@/lib/marketCategories';
import { getCategoryDotClass } from '@/lib/categoryStyles';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { formatCountdown, formatUsd } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { Market } from '@/types';

const DESCRIPTION_CLAMP = 160;

export function MarketDetailHeader({ market }: { market: Market }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const { labelKey } = getCategoryMeta(market.category);
  const categoryLabel = labelKey ? t(labelKey) : market.category;
  const dotClass = getCategoryDotClass(market.category);

  const description = market.description ?? '';
  const needsClamp = description.length > DESCRIPTION_CLAMP;
  const displayDescription =
    needsClamp && !expanded ? `${description.slice(0, DESCRIPTION_CLAMP).trim()}…` : description;

  return (
    <header className="mb-4">
      <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/" className="transition hover:text-brand-blue">
          {t('nav.markets')}
        </Link>
        {market.category && categoryLabel && (
          <>
            <span aria-hidden>›</span>
            <Link href="/" className="transition hover:text-brand-blue">
              {categoryLabel}
            </Link>
          </>
        )}
      </nav>

      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <h1 className="flex-1 text-2xl font-bold leading-tight text-text-primary">
          {market.title}
        </h1>
        <MarketStatusBadge status={market.status} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
        {market.category && categoryLabel && (
          <span className="inline-flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} aria-hidden />
            {categoryLabel}
          </span>
        )}
        <span>
          {t('trading.volume')}{' '}
          <span className="font-medium text-text-primary">{formatUsd(market.volume)}</span>
        </span>
        {market.closesAt && (
          <span>
            {t('trading.ends')}{' '}
            <ClientLiveText className="font-medium text-text-primary">
              {() => formatCountdown(market.closesAt)}
            </ClientLiveText>
          </span>
        )}
      </div>

      {description && (
        <div className="mt-3">
          <p className="text-sm leading-relaxed text-text-secondary">{displayDescription}</p>
          {needsClamp && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-brand-blue hover:underline"
            >
              {expanded ? t('trading.showLess') : t('trading.showMore')}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
