'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MARKET_CATEGORIES } from '@/lib/marketCategories';
import { useMarketFilterStore } from '@/stores/marketFilterStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

export function CategoryNav() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { category, setCategory, setSubcategory } = useMarketFilterStore();

  const handleSelect = useCallback(
    (value: string) => {
      if (value === 'more') return;
      setCategory(value);
      setSubcategory('');
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'hot') {
        params.set('category', value);
      } else {
        params.delete('category');
      }
      params.delete('subcategory');
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/', { scroll: false });
    },
    [router, searchParams, setCategory, setSubcategory],
  );

  return (
    <nav
      aria-label={t('markets.categoryTabsAria')}
      className="sticky top-14 z-40 border-b border-border bg-card"
    >
      <div className="mx-auto max-w-8xl px-4 md:px-6 lg:px-8">
        <div className="scrollbar-none flex gap-1 overflow-x-auto py-1">
          {MARKET_CATEGORIES.map((cat) => {
            const active = category === cat.value || (category === '' && cat.value === 'hot');
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleSelect(cat.value)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm transition-opacity duration-150',
                  active
                    ? 'border-b-2 border-text-primary font-semibold text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <span className="text-base leading-none" aria-hidden>
                  {cat.icon}
                </span>
                {t(cat.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
