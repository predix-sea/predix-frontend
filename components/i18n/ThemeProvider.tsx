'use client';

import { useEffect } from 'react';
import { useThemeStore, applyThemeClass } from '@/stores/themeStore';

const THEME_KEY = 'theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme);
    }
    applyThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    const stored =
      (typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null) as
        | 'light'
        | 'dark'
        | null;
    if (stored === 'light' || stored === 'dark') {
      useThemeStore.getState().setTheme(stored);
      applyThemeClass(stored);
      return;
    }
    applyThemeClass(useThemeStore.getState().theme);
  }, []);

  return children;
}
