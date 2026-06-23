import type { Market } from '@/types';
import type { MarketSort, MarketTimeRange } from '@/stores/marketFilterStore';
import { mapApiCategoryToNav } from '@/lib/marketCategories';

export function filterMarkets(
  markets: Market[],
  opts: {
    category: string;
    subcategory: string;
    query: string;
    status: string;
    timeRange: MarketTimeRange;
    bookmarkIds: string[];
    showBookmarksOnly: boolean;
  },
): Market[] {
  let result = [...markets];

  if (opts.showBookmarksOnly) {
    result = result.filter((m) => opts.bookmarkIds.includes(m.id));
  }

  if (opts.query) {
    const q = opts.query.toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q),
    );
  }

  if (opts.status) {
    result = result.filter((m) => m.status.toUpperCase() === opts.status.toUpperCase());
  }

  if (opts.category && opts.category !== 'hot') {
    result = result.filter((m) => {
      const nav = mapApiCategoryToNav(m.category);
      return nav === opts.category || m.category?.toLowerCase() === opts.category;
    });
  }

  if (opts.subcategory) {
    const needle = opts.subcategory.replace('-', ' ').toLowerCase();
    result = result.filter((m) => {
      const title = m.title.toLowerCase();
      const desc = m.description?.toLowerCase() ?? '';
      return title.includes(needle) || desc.includes(needle);
    });
  }

  if (opts.timeRange !== 'all') {
    const now = Date.now();
    const ms =
      opts.timeRange === '24h'
        ? 86400000
        : opts.timeRange === '7d'
          ? 604800000
          : 2592000000;
    result = result.filter((m) => {
      if (!m.createdAt) return true;
      return now - new Date(m.createdAt).getTime() <= ms;
    });
  }

  return result;
}

export function sortMarkets(markets: Market[], sort: MarketSort): Market[] {
  const sorted = [...markets];
  switch (sort) {
    case 'volume':
      return sorted.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
    case 'ending':
      return sorted.sort((a, b) => {
        if (!a.closesAt) return 1;
        if (!b.closesAt) return -1;
        return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
      });
    case 'newest':
      return sorted.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'probability':
      return sorted.sort((a, b) => {
        const aProb = a.outcomes[0]?.probability ?? 0;
        const bProb = b.outcomes[0]?.probability ?? 0;
        return bProb - aProb;
      });
    default:
      return sorted;
  }
}
