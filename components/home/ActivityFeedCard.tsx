'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { Market } from '@/types';
import type { ActivityFeedItem } from '@/lib/mockActivityFeed';
import {
  ACTIVITY_FEED_ANCHOR_MS,
  generateActivityFeed,
  formatRelativeTime,
} from '@/lib/mockActivityFeed';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import { getCategoryDotClass } from '@/lib/categoryStyles';

const COLLAPSED_COUNT = 4;
const FEED_COUNT = 12;
/** Expanded list cap: min(280px, viewport minus header, newsletter, card chrome). */
const EXPANDED_LIST_MAX_H = 'max-h-[min(280px,calc(100vh-420px))]';

export function ActivityFeedCard({
  markets,
  className,
}: {
  markets: Market[];
  className?: string;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const items = useMemo(
    () => generateActivityFeed(markets, FEED_COUNT, ACTIVITY_FEED_ANCHOR_MS),
    [markets],
  );
  const visibleItems = expanded ? items : items.slice(0, COLLAPSED_COUNT);
  const canExpand = items.length > COLLAPSED_COUNT;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4',
        expanded && 'flex min-h-0 flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{t('home.activity.title')}</h3>
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-text-secondary transition hover:bg-background hover:text-text-primary"
          >
            {expanded ? t('home.activity.collapse') : t('home.activity.expand')}
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')}
              aria-hidden
            />
          </button>
        )}
      </div>

      <div className={cn('relative mt-3', expanded && 'min-h-0 flex-1')}>
        <ul
          className={cn(
            'space-y-3',
            expanded && cn('scroll-contained', EXPANDED_LIST_MAX_H),
          )}
        >
          {visibleItems.map((item) => (
            <ActivityFeedRow key={item.id} item={item} t={t} />
          ))}
          {!items.length && (
            <li className="py-4 text-center text-xs text-text-secondary">
              {t('home.activity.empty')}
            </li>
          )}
        </ul>
        {expanded && canExpand && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent"
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

function ActivityFeedRow({
  item,
  t,
}: {
  item: ActivityFeedItem;
  t: (key: string) => string;
}) {
  const dotClass = getCategoryDotClass(item.category);
  const categoryLabel = item.categoryLabelKey ? t(item.categoryLabelKey) : item.category;

  return (
    <li>
      <Link
        href={`/market/${item.marketId}`}
        className="group block rounded-lg p-2 transition hover:bg-background"
      >
        <div className="mb-1 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-text-secondary',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', dotClass)} aria-hidden />
            {categoryLabel}
          </span>
          <ClientLiveText
            className="ml-auto text-[10px] tabular-nums text-text-secondary"
            placeholder="—"
          >
            {() => formatRelativeTime(item.timestamp)}
          </ClientLiveText>
        </div>
        <p className="line-clamp-2 text-xs leading-snug text-text-primary group-hover:text-brand-blue">
          {item.title}
        </p>
      </Link>
    </li>
  );
}
