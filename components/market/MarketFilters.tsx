'use client';

import * as Popover from '@radix-ui/react-popover';
import { SlidersHorizontal, Filter, Bookmark } from 'lucide-react';
import { useMarketFilterStore } from '@/stores/marketFilterStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

export function MarketFilters() {
  const { t } = useTranslation();
  const {
    status,
    sort,
    timeRange,
    showBookmarksOnly,
    setStatus,
    setSort,
    setTimeRange,
    setShowBookmarksOnly,
  } = useMarketFilterStore();

  const statusOptions = [
    { value: '', label: t('filters.allStatus') },
    { value: 'OPEN', label: t('market.open') },
    { value: 'CLOSED', label: t('filters.endingSoon') },
    { value: 'RESOLVED', label: t('status.resolved') },
  ];

  const sortOptions = [
    { value: 'volume', label: t('filters.sortVolume') },
    { value: 'ending', label: t('filters.sortEnding') },
    { value: 'newest', label: t('filters.sortNewest') },
    { value: 'probability', label: t('filters.sortProbability') },
  ];

  const timeOptions = [
    { value: '24h', label: t('filters.time24h') },
    { value: '7d', label: t('filters.time7d') },
    { value: '30d', label: t('filters.time30d') },
    { value: 'all', label: t('filters.timeAll') },
  ];

  return (
    <div className="flex items-center gap-1">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={t('filters.open')}
            className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            className="z-50 w-64 rounded-xl border border-border bg-card p-4 shadow-lg animate-in fade-in slide-in-from-top-2"
          >
            <FilterSection title={t('filters.status')}>
              {statusOptions.map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={status === opt.value}
                  onClick={() => setStatus(opt.value)}
                  label={opt.label}
                />
              ))}
            </FilterSection>
            <FilterSection title={t('filters.sort')}>
              {sortOptions.map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={sort === opt.value}
                  onClick={() => setSort(opt.value as typeof sort)}
                  label={opt.label}
                />
              ))}
            </FilterSection>
            <FilterSection title={t('filters.time')}>
              {timeOptions.map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={timeRange === opt.value}
                  onClick={() => setTimeRange(opt.value as typeof timeRange)}
                  label={opt.label}
                />
              ))}
            </FilterSection>
            <Popover.Arrow className="fill-border" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <button
        type="button"
        aria-label={t('filters.open')}
        className="rounded-lg border border-border p-2 text-text-secondary transition hover:bg-background hover:text-text-primary"
      >
        <Filter className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label={t('filters.bookmarks')}
        aria-pressed={showBookmarksOnly}
        onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
        className={cn(
          'rounded-lg border border-border p-2 transition',
          showBookmarksOnly
            ? 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue'
            : 'text-text-secondary hover:bg-background hover:text-text-primary',
        )}
      >
        <Bookmark className={cn('h-4 w-4', showBookmarksOnly && 'fill-current')} />
      </button>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg px-2.5 py-1 text-xs font-medium transition',
        active
          ? 'bg-brand-blue text-white'
          : 'bg-background text-text-secondary hover:text-text-primary',
      )}
    >
      {label}
    </button>
  );
}
