import { beforeEach, describe, expect, it } from 'vitest';
import { getMessages, t } from '@/lib/i18n';
import { detectBrowserLocale, isSupportedLocale } from '@/lib/i18n/locales';
import { useLocaleStore } from '@/stores/localeStore';

describe('i18n', () => {
  it('returns localized strings for known keys', () => {
    expect(t('nav.markets', 'en')).toBe('Markets');
    expect(t('nav.markets', 'zh-CN')).toBe('市场');
    expect(t('nav.markets', 'vi')).toBe('Thị trường');
  });

  it('falls back to en when key is missing in locale', () => {
    expect(t('test.fallbackOnly', 'zh-CN')).toBe('English fallback value');
    expect(t('test.fallbackOnly', 'th')).toBe('English fallback value');
  });

  it('returns the key when missing in all locales', () => {
    expect(t('missing.key.path', 'en')).toBe('missing.key.path');
  });

  it('loads message catalogs per locale', () => {
    expect(getMessages('id').markets.title).toBe('Pasar');
    expect(getMessages('ms').common.language).toBe('Bahasa');
  });

  it('detects browser locale patterns', () => {
    const original = navigator.language;
    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'zh-CN',
    });
    expect(detectBrowserLocale()).toBe('zh-CN');

    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'th-TH',
    });
    expect(detectBrowserLocale()).toBe('th');

    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: 'fr-FR',
    });
    expect(detectBrowserLocale()).toBe('en');

    Object.defineProperty(navigator, 'language', {
      configurable: true,
      value: original,
    });
  });

  it('validates supported locale codes', () => {
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('zh-CN')).toBe(true);
    expect(isSupportedLocale('fr')).toBe(false);
  });
});

describe('localeStore persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useLocaleStore.setState({ locale: 'en' });
    useLocaleStore.persist.clearStorage();
  });

  it('persists locale to predix-locale storage key', () => {
    useLocaleStore.getState().setLocale('zh-TW');

    const raw = localStorage.getItem('predix-locale');
    expect(raw).not.toBeNull();
    expect(raw).toContain('zh-TW');
    expect(useLocaleStore.getState().locale).toBe('zh-TW');
  });

  it('updates store locale immediately when setLocale is called', () => {
    useLocaleStore.getState().setLocale('vi');
    expect(useLocaleStore.getState().locale).toBe('vi');
    expect(localStorage.getItem('predix-locale')).toContain('vi');
  });
});
