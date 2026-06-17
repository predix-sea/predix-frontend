'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/localeStore';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return children;
}
