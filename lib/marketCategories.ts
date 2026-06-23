export type CategoryDotToken =
  | 'category-trending'
  | 'category-crypto'
  | 'category-macro'
  | 'category-sports'
  | 'category-politics'
  | 'category-environment';

export interface MarketCategory {
  value: string;
  labelKey: string;
  icon: string;
  dotToken?: CategoryDotToken;
}

export const MARKET_CATEGORIES: MarketCategory[] = [
  { value: 'hot', labelKey: 'category.hot', icon: '🔥', dotToken: 'category-trending' },
  { value: 'worldcup', labelKey: 'category.worldcup', icon: '🏆', dotToken: 'category-sports' },
  { value: 'breaking', labelKey: 'category.breaking', icon: '⚡', dotToken: 'category-trending' },
  { value: 'politics', labelKey: 'category.politics', icon: '🏛️', dotToken: 'category-politics' },
  { value: 'sports', labelKey: 'category.sports', icon: '⚽', dotToken: 'category-sports' },
  { value: 'crypto', labelKey: 'category.crypto', icon: '₿', dotToken: 'category-crypto' },
  { value: 'esports', labelKey: 'category.esports', icon: '🎮', dotToken: 'category-sports' },
  { value: 'macro', labelKey: 'category.macro', icon: '📊', dotToken: 'category-macro' },
  { value: 'geopolitics', labelKey: 'category.geopolitics', icon: '🌍', dotToken: 'category-politics' },
  { value: 'tech', labelKey: 'category.tech', icon: '💻', dotToken: 'category-trending' },
  { value: 'culture', labelKey: 'category.culture', icon: '🎭', dotToken: 'category-trending' },
  { value: 'economy', labelKey: 'category.economy', icon: '💹', dotToken: 'category-macro' },
  { value: 'weather', labelKey: 'category.weather', icon: '🌤️', dotToken: 'category-environment' },
  { value: 'elections', labelKey: 'category.elections', icon: '🗳️', dotToken: 'category-politics' },
  { value: 'more', labelKey: 'category.more', icon: '▼' },
];

const DEFAULT_DOT_TOKEN: CategoryDotToken = 'category-trending';

export function getCategoryMeta(category?: string): {
  labelKey: string | null;
  dotToken: CategoryDotToken;
  color: string;
} {
  const normalized = category?.toLowerCase() ?? '';
  const found = MARKET_CATEGORIES.find((c) => c.value === normalized);
  if (found?.dotToken) {
    return {
      labelKey: found.labelKey,
      dotToken: found.dotToken,
      color: `var(--${found.dotToken})`,
    };
  }
  const legacy = LEGACY_CATEGORY_MAP[normalized];
  if (legacy) {
    return {
      labelKey: legacy.labelKey,
      dotToken: legacy.dotToken,
      color: `var(--${legacy.dotToken})`,
    };
  }
  return {
    labelKey: null,
    dotToken: DEFAULT_DOT_TOKEN,
    color: `var(--${DEFAULT_DOT_TOKEN})`,
  };
}

const LEGACY_CATEGORY_MAP: Record<string, { labelKey: string; dotToken: CategoryDotToken }> = {
  trending: { labelKey: 'category.hot', dotToken: 'category-trending' },
  environment: { labelKey: 'category.weather', dotToken: 'category-environment' },
};

export function getCategoryByValue(value: string): MarketCategory | undefined {
  return MARKET_CATEGORIES.find((c) => c.value === value);
}

export function mapApiCategoryToNav(category?: string): string {
  if (!category) return 'hot';
  const normalized = category.toLowerCase();
  if (MARKET_CATEGORIES.some((c) => c.value === normalized)) return normalized;
  if (normalized === 'trending') return 'hot';
  if (normalized === 'environment') return 'weather';
  return normalized;
}
