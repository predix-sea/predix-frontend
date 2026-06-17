'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MarketGrid } from '@/components/market/MarketGrid';
import { MarketFilters } from '@/components/market/MarketFilters';
import { useMarkets } from '@/hooks/useMarkets';
import { useMarketFilterStore } from '@/stores/marketFilterStore';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useTranslation } from '@/hooks/useTranslation';
import { getCategoryByValue } from '@/lib/marketCategories';
import { filterMarkets, sortMarkets } from '@/lib/marketSorting';

function MarketsContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const {
    status,
    category,
    subcategory,
    query,
    sort,
    timeRange,
    showBookmarksOnly,
    sidebarOpen,
    setCategory,
    setSubcategory,
    setSidebarOpen,
  } = useMarketFilterStore();
  const bookmarkIds = useBookmarkStore((s) => s.ids);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSub = searchParams.get('subcategory');
    if (urlCategory) setCategory(urlCategory);
    if (urlSub) setSubcategory(urlSub);
  }, [searchParams, setCategory, setSubcategory]);

  const apiCategory = category && category !== 'hot' ? category : undefined;
  const filters = useMemo(
    () => ({
      status: status || undefined,
      category: apiCategory,
      q: query || undefined,
    }),
    [status, apiCategory, query],
  );

  const { data: markets, isLoading, error } = useMarkets(filters);

  const displayed = useMemo(() => {
    if (!markets) return [];
    const filtered = filterMarkets(markets, {
      category,
      subcategory,
      query,
      status,
      timeRange,
      bookmarkIds,
      showBookmarksOnly,
    });
    return sortMarkets(filtered, sort);
  }, [
    markets,
    category,
    subcategory,
    query,
    status,
    timeRange,
    bookmarkIds,
    showBookmarksOnly,
    sort,
  ]);

  const catMeta = getCategoryByValue(category);
  const sectionTitle = catMeta ? t(catMeta.labelKey) : t('category.hot');

  return (
    <div className="mx-auto flex max-w-8xl">
      <Sidebar
        markets={markets ?? []}
        mobile
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <Sidebar markets={markets ?? []} />

      <div className="min-w-0 flex-1 px-4 py-4 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Open filters"
              className="rounded-lg border border-border p-2 text-text-secondary lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
            <h1 className="text-2xl font-bold text-text-primary transition-opacity duration-150">
              {sectionTitle}
            </h1>
          </div>
          <MarketFilters />
        </div>

        {error && (
          <p className="py-12 text-center text-no">{t('markets.loadError')}</p>
        )}

        {!error && (
          <>
            <MarketGrid markets={displayed} loading={isLoading} />
            {!isLoading && !displayed.length && (
              <p className="py-12 text-center text-text-secondary">{t('markets.noMarkets')}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function MarketsPage() {
  return (
    <Suspense fallback={null}>
      <MarketsContent />
    </Suspense>
  );
}
