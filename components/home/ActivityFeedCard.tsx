'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Market } from '@/types';
import {
  ACTIVITY_FEED_ANCHOR_MS,
  generateActivityFeed,
  formatRelativeTime,
} from '@/lib/mockActivityFeed';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import { getCategoryDotClass } from '@/lib/categoryStyles';

export function ActivityFeedCard({ markets }: { markets: Market[] }) {
  const { t } = useTranslation();
  const items = useMemo(() => generateActivityFeed(markets, 6, ACTIVITY_FEED_ANCHOR_MS), [markets]);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-text-primary">{t('home.activity.title')}</h3>

      <ul className="mt-3 space-y-3">
        {items.map((item) => {
          const dotClass = getCategoryDotClass(item.category);
          const categoryLabel = item.categoryLabelKey
            ? t(item.categoryLabelKey)
            : item.category;

          return (
            <li key={item.id}>
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
        })}
        {!items.length && (
          <li className="py-4 text-center text-xs text-text-secondary">{t('home.activity.empty')}</li>
        )}
      </ul>
    </div>
  );
}
