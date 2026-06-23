'use client';

import { useCallback } from 'react';
import { t as translate } from '@/lib/i18n';
import { useLocaleStore } from '@/stores/localeStore';

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(key, locale, vars),
    [locale],
  );

  return { t, locale, setLocale };
}
