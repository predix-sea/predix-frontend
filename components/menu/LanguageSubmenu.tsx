'use client';

import { SUPPORTED_LOCALES } from '@/lib/i18n/locales';
import { useLocaleStore } from '@/stores/localeStore';
import { cn } from '@/lib/cn';

const FLAG_BY_LOCALE: Record<string, string> = {
  en: '🇺🇸',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  my: '🇲🇲',
  id: '🇮🇩',
  vi: '🇻🇳',
  th: '🇹🇭',
  ms: '🇲🇾',
};

export function LanguageSubmenu({ onSelect }: { onSelect?: () => void }) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <div className="mb-1 ml-2 border-l border-border pl-2">
      {SUPPORTED_LOCALES.map((loc) => (
        <button
          key={loc.code}
          type="button"
          onClick={() => {
            setLocale(loc.code);
            onSelect?.();
          }}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-background hover:text-text-primary',
            locale === loc.code && 'font-medium text-text-primary',
          )}
        >
          <span aria-hidden>{FLAG_BY_LOCALE[loc.code] ?? '🌐'}</span>
          {loc.nativeLabel}
        </button>
      ))}
    </div>
  );
}
