'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Market } from '@/types';
import { MarketSparkline } from './MarketSparkline';
import { getCategoryDotClass } from '@/lib/categoryStyles';
import { getYesPrice } from '@/lib/marketPricing';
import { formatUsd } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';
import { useTradeAuthGate } from '@/hooks/useTradeAuthGate';
import { cn } from '@/lib/cn';

function isYesNo(label: string): 'yes' | 'no' | null {
  const lower = label.toLowerCase();
  if (lower === 'yes') return 'yes';
  if (lower === 'no') return 'no';
  return null;
}

export function MarketListRow({ market }: { market: Market }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { gateTradeNavigation } = useTradeAuthGate();
  const dotClass = getCategoryDotClass(market.category);
  const yesPrice = getYesPrice(market);
  const pct = yesPrice !== undefined ? Math.round(yesPrice * 100) : null;

  const yes = market.outcomes.find((o) => isYesNo(o.label) === 'yes');
  const no = market.outcomes.find((o) => isYesNo(o.label) === 'no');

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/market/${market.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/market/${market.id}`);
        }
      }}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 transition hover:border-border hover:shadow-card sm:gap-4 sm:px-4"
    >
      <div className="shrink-0">
        {market.imageUrl ? (
          <img
            src={market.imageUrl}
            alt=""
            className="h-10 w-10 rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
            <span className={cn('h-2.5 w-2.5 rounded-full', dotClass)} aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:text-brand-blue">
          {market.title}
        </h3>
        {market.volume !== undefined && (
          <p className="mt-0.5 text-xs text-text-secondary">
            {t('market.volume')} {formatUsd(market.volume)}
          </p>
        )}
      </div>

      {pct !== null && (
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-lg font-bold tabular-nums text-text-primary">{pct}%</p>
          <MarketSparkline marketId={market.id} positive={pct >= 50} />
        </div>
      )}

      {(yes || no) && (
        <div className="flex shrink-0 gap-1.5">
          {yes && (
            <Link
              href={`/market/${market.id}?outcome=${yes.id}`}
              onClick={gateTradeNavigation}
              className="rounded-lg border border-yes/30 px-2.5 py-1 text-xs font-medium text-yes transition hover:bg-yes/10"
            >
              {t('market.yes')}
            </Link>
          )}
          {no && (
            <Link
              href={`/market/${market.id}?outcome=${no.id}`}
              onClick={gateTradeNavigation}
              className="rounded-lg border border-no/30 px-2.5 py-1 text-xs font-medium text-no transition hover:bg-no/10"
            >
              {t('market.no')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function MarketListRowSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-border" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-3 w-1/3 rounded bg-border" />
        </div>
        <div className="h-8 w-16 rounded bg-border" />
      </div>
    </div>
  );
}

export function MarketList({ markets, loading }: { markets: Market[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <MarketListRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {markets.map((market) => (
        <MarketListRow key={market.id} market={market} />
      ))}
    </div>
  );
}
