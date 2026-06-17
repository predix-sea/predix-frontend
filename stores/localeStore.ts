import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectBrowserLocale, type SupportedLocale } from '@/lib/i18n/locales';

interface LocaleState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: detectBrowserLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'predix-locale',
    },
  ),
);
