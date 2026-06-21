'use client';

import Link from 'next/link';
import type { Market } from '@/types';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { formatCountdown, formatUsd } from '@/lib/format';
import { getYesPrice } from '@/lib/marketPricing';
import { useTranslation } from '@/hooks/useTranslation';
import { useTradeAuthGate } from '@/hooks/useTradeAuthGate';
import { cn } from '@/lib/cn';

export function FeatureMarketCard({
  market,
  className,
}: {
  market: Market;
  className?: string;
}) {
  const { t } = useTranslation();
  const { gateTradeNavigation } = useTradeAuthGate();
  const yesPrice = getYesPrice(market);
  const pct = yesPrice !== undefined ? Math.round(yesPrice * 100) : null;

  const statusKey = market.status.toUpperCase();
  const statusLabel =
    statusKey === 'OPEN'
      ? t('market.open')
      : statusKey === 'RESOLVED'
        ? t('status.resolved')
        : market.status;

  const yes = market.outcomes.find((o) => o.label.toLowerCase() === 'yes');
  const no = market.outcomes.find((o) => o.label.toLowerCase() === 'no');

  return (
    <Link
      href={`/market/${market.id}`}
      className={cn(
        'group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-card-hover sm:col-span-2 sm:row-span-2 lg:min-h-[320px]',
        className,
      )}
    >
      <div className="absolute inset-0">
        {market.imageUrl ? (
          <img src={market.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-blue/30 via-brand-blue/10 to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative mt-auto flex flex-col p-5 text-white">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Badge variant={statusToBadgeVariant(market.status)} className="bg-white/10 text-white">
            {statusLabel}
          </Badge>
          <BookmarkButton marketId={market.id} className="text-white hover:text-white" />
        </div>

        <h3 className="text-xl font-bold leading-tight text-white drop-shadow-sm lg:text-2xl">
          {market.title}
        </h3>

        {pct !== null && (
          <p className="mt-2 text-3xl font-bold tabular-nums text-white">{pct}%</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {yes && (
            <Link
              href={`/market/${market.id}?outcome=${yes.id}`}
              onClick={gateTradeNavigation}
              className="rounded-lg border border-yes/50 bg-yes/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-yes/30"
            >
              {t('market.yes')}
            </Link>
          )}
          {no && (
            <Link
              href={`/market/${market.id}?outcome=${no.id}`}
              onClick={gateTradeNavigation}
              className="rounded-lg border border-no/50 bg-no/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-no/30"
            >
              {t('market.no')}
            </Link>
          )}
        </div>

        <div className="mt-3 flex gap-4 text-sm text-white/80">
          <span className="tabular-nums">
            {t('market.volume')} {formatUsd(market.volume)}
          </span>
          {market.closesAt && (
            <span className="tabular-nums">
              {t('market.ends')} {formatCountdown(market.closesAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
