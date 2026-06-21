'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Market, Outcome } from '@/types';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { ProbabilityRing } from '@/components/market/ProbabilityRing';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { formatCountdown, formatUsd } from '@/lib/format';
import { getCategoryDotClass } from '@/lib/categoryStyles';
import { getYesPrice } from '@/lib/marketPricing';
import { useTranslation } from '@/hooks/useTranslation';
import { useTradeAuthGate } from '@/hooks/useTradeAuthGate';
import { cn } from '@/lib/cn';

function isYesNo(label: string): 'yes' | 'no' | null {
  const lower = label.toLowerCase();
  if (lower === 'yes') return 'yes';
  if (lower === 'no') return 'no';
  return null;
}

function YesNoButtons({ market, compact }: { market: Market; compact?: boolean }) {
  const { t } = useTranslation();
  const { gateTradeNavigation } = useTradeAuthGate();
  const yes = market.outcomes.find((o) => isYesNo(o.label) === 'yes');
  const no = market.outcomes.find((o) => isYesNo(o.label) === 'no');

  if (!yes && !no) return null;

  return (
    <div className={cn('flex gap-2', compact ? 'gap-1' : '')}>
      {yes && (
        <Link
          href={`/market/${market.id}?outcome=${yes.id}`}
          onClick={gateTradeNavigation}
          className={cn(
            'rounded-lg border border-yes/30 font-medium text-yes transition hover:bg-yes/10',
            compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
          )}
        >
          {t('market.yes')}
        </Link>
      )}
      {no && (
        <Link
          href={`/market/${market.id}?outcome=${no.id}`}
          onClick={gateTradeNavigation}
          className={cn(
            'rounded-lg border border-no/30 font-medium text-no transition hover:bg-no/10',
            compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
          )}
        >
          {t('market.no')}
        </Link>
      )}
    </div>
  );
}

function MultiOutcomeRows({ outcomes, marketId }: { outcomes: Outcome[]; marketId: string }) {
  const { t } = useTranslation();
  const { gateTradeNavigation } = useTradeAuthGate();
  const visible = outcomes.slice(0, 3);
  const rest = outcomes.length - 3;

  return (
    <div className="mt-3 space-y-2">
      {visible.map((o) => {
        const pct =
          o.probability !== undefined ? `${Math.round(o.probability * 100)}%` : '—';
        const side = isYesNo(o.label);
        return (
          <div key={o.id} className="flex items-center gap-2 text-xs">
            <span className="min-w-0 flex-1 truncate text-text-primary">{o.label}</span>
            <span className="shrink-0 tabular-nums font-medium text-text-secondary">{pct}</span>
            {side && (
              <Link
                href={`/market/${marketId}?outcome=${o.id}`}
                onClick={gateTradeNavigation}
                className={cn(
                  'shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium',
                  side === 'yes'
                    ? 'border-yes/30 text-yes hover:bg-yes/10'
                    : 'border-no/30 text-no hover:bg-no/10',
                )}
              >
                {side === 'yes' ? t('market.yes') : t('market.no')}
              </Link>
            )}
          </div>
        );
      })}
      {rest > 0 && (
        <p className="text-xs text-text-secondary">{t('market.moreOutcomes', { count: rest })}</p>
      )}
    </div>
  );
}

export function MarketCard({ market }: { market: Market }) {
  const router = useRouter();
  const { t } = useTranslation();
  const dotClass = getCategoryDotClass(market.category);
  const yesPrice = getYesPrice(market);
  const isBinary =
    market.outcomes.length === 2 &&
    market.outcomes.some((o) => isYesNo(o.label) === 'yes') &&
    market.outcomes.some((o) => isYesNo(o.label) === 'no');

  const statusKey = market.status.toUpperCase();
  const statusLabel =
    statusKey === 'OPEN'
      ? t('market.open')
      : statusKey === 'RESOLVED'
        ? t('status.resolved')
        : market.status;

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
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-border hover:shadow-card-hover"
    >
      <div className="flex gap-3">
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-text-primary group-hover:text-brand-blue">
              {market.title}
            </h3>
            <Badge variant={statusToBadgeVariant(market.status)}>{statusLabel}</Badge>
          </div>
        </div>

        {isBinary && yesPrice !== undefined && (
          <ProbabilityRing value={yesPrice} size={52} className="hidden sm:block" />
        )}
      </div>

      {isBinary ? (
        <div className="mt-3 flex items-end justify-between gap-2">
          <YesNoButtons market={market} />
          {yesPrice !== undefined && (
            <ProbabilityRing value={yesPrice} size={48} className="sm:hidden" />
          )}
        </div>
      ) : (
        <MultiOutcomeRows outcomes={market.outcomes} marketId={market.id} />
      )}

      <div className="mt-auto flex items-center justify-between pt-3 text-sm text-text-secondary">
        <span className="tabular-nums">
          {t('market.volume')}{' '}
          <span className="font-medium text-text-primary">{formatUsd(market.volume)}</span>
        </span>
        {market.closesAt && (
          <span className="tabular-nums">
            {t('market.ends')}{' '}
            <span className="font-medium text-text-primary">
              <ClientLiveText>{() => formatCountdown(market.closesAt)}</ClientLiveText>
            </span>
          </span>
        )}
        <BookmarkButton marketId={market.id} />
      </div>
    </div>
  );
}
