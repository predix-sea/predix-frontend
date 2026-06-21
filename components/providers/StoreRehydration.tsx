'use client';

import { useEffect } from 'react';
import { detectBrowserLocale, DEFAULT_LOCALE } from '@/lib/i18n/locales';
import { useLocaleStore } from '@/stores/localeStore';
import { useThemeStore } from '@/stores/themeStore';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useAuthStore } from '@/stores/authStore';

/** Rehydrate persisted client stores after mount to avoid SSR/client text mismatches. */
export function StoreRehydration() {
  useEffect(() => {
    const hadLocale = localStorage.getItem('predix-locale') !== null;

    void Promise.all([
      useLocaleStore.persist.rehydrate(),
      useThemeStore.persist.rehydrate(),
      useBookmarkStore.persist.rehydrate(),
      useAuthStore.persist.rehydrate(),
    ]).then(() => {
      if (!hadLocale) {
        const detected = detectBrowserLocale();
        if (detected !== DEFAULT_LOCALE) {
          useLocaleStore.getState().setLocale(detected);
        }
      }
    });
  }, []);

  return null;
}
