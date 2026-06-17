import { MARKET_CATEGORIES, type CategoryDotToken } from '@/lib/marketCategories';

const DOT_CLASS_BY_TOKEN: Record<CategoryDotToken, string> = {
  'category-trending': 'bg-category-trending/60',
  'category-crypto': 'bg-category-crypto/60',
  'category-macro': 'bg-category-macro/60',
  'category-sports': 'bg-category-sports/60',
  'category-politics': 'bg-category-politics/60',
  'category-environment': 'bg-category-environment/60',
};

const DEFAULT_DOT_CLASS = DOT_CLASS_BY_TOKEN['category-trending'];

function dotClassForToken(token: CategoryDotToken): string {
  return DOT_CLASS_BY_TOKEN[token] ?? DEFAULT_DOT_CLASS;
}

export function getCategoryDotClass(category?: string): string {
  const normalized = category?.toLowerCase() ?? '';
  const found = MARKET_CATEGORIES.find((c) => c.value === normalized);
  if (found?.dotToken) return dotClassForToken(found.dotToken);
  if (normalized === 'trending' || normalized === 'environment') {
    return normalized === 'environment'
      ? DOT_CLASS_BY_TOKEN['category-environment']
      : DEFAULT_DOT_CLASS;
  }
  return DEFAULT_DOT_CLASS;
}

export function getCategoryDotClassForValue(value: string): string {
  const found = MARKET_CATEGORIES.find((c) => c.value === value);
  if (found?.dotToken) return dotClassForToken(found.dotToken);
  return DEFAULT_DOT_CLASS;
}
