import { describe, expect, it } from 'vitest';
import { getCategoryDotClass, getCategoryDotClassForValue } from '@/lib/categoryStyles';

describe('categoryStyles', () => {
  it('returns token-based dot classes without inline colors', () => {
    expect(getCategoryDotClass('crypto')).toBe('bg-category-crypto/60');
    expect(getCategoryDotClass('macro')).toBe('bg-category-macro/60');
    expect(getCategoryDotClass()).toBe('bg-category-trending/60');
    expect(getCategoryDotClass('unknown')).toBe('bg-category-trending/60');
  });

  it('maps category value to dot class for filter chips', () => {
    expect(getCategoryDotClassForValue('')).toBe('bg-category-trending/60');
    expect(getCategoryDotClassForValue('politics')).toBe('bg-category-politics/60');
  });
});
