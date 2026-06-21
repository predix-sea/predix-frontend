import type { Market } from '@/types';
import { getCategoryMeta } from '@/lib/marketCategories';

export interface ActivityFeedItem {
  id: string;
  marketId: string;
  category: string;
  categoryLabelKey: string | null;
  title: string;
  timestamp: number;
}

const ACTIVITY_TEMPLATES = [
  'New market listed',
  'Volume surge on',
  'Probability shift on',
  'Trending now',
  'High activity on',
] as const;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Stable anchor for SSR — activity timestamps are offsets from this instant. */
export const ACTIVITY_FEED_ANCHOR_MS = 1_735_689_600_000;

export function formatRelativeTime(timestamp: number, nowMs = Date.now()): string {
  const diff = nowMs - timestamp;
  if (diff < 60_000) return 'just now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function generateActivityFeed(
  markets: Market[],
  count = 6,
  nowMs = ACTIVITY_FEED_ANCHOR_MS,
): ActivityFeedItem[] {
  if (!markets.length) return [];

  const pool = [...markets].sort((a, b) => hashId(b.id) - hashId(a.id));
  const size = Math.min(Math.max(count, 1), pool.length);

  return pool.slice(0, size).map((market, index) => {
    const meta = getCategoryMeta(market.category);
    const template = ACTIVITY_TEMPLATES[index % ACTIVITY_TEMPLATES.length];
    const minutesAgo = (index + 1) * 7 + (hashId(market.id) % 45);

    return {
      id: `activity-${market.id}-${index}`,
      marketId: market.id,
      category: market.category ?? 'trending',
      categoryLabelKey: meta.labelKey,
      title: `${template}: ${market.title}`,
      timestamp: nowMs - minutesAgo * 60_000,
    };
  });
}

export function generateSparklinePoints(marketId: string, length = 12): number[] {
  const seed = hashId(marketId);
  const points: number[] = [];
  let value = 0.35 + (seed % 30) / 100;

  for (let i = 0; i < length; i++) {
    const delta = ((seed >> (i % 8)) & 7) / 100 - 0.03;
    value = Math.min(0.95, Math.max(0.05, value + delta));
    points.push(value);
  }

  return points;
}
