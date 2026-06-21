'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/localeStore';
import { StoreRehydration } from '@/components/providers/StoreRehydration';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      <StoreRehydration />
      {children}
    </>
  );
}
