'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/lib/i18n/locales';
import { useLocaleStore } from '@/stores/localeStore';
import { cn } from '@/lib/cn';

const FLAG_BY_LOCALE: Record<SupportedLocale, string> = {
  en: '🇺🇸',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  my: '🇲🇲',
  id: '🇮🇩',
  vi: '🇻🇳',
  th: '🇹🇭',
  ms: '🇲🇾',
};

function LocaleFlag({ code }: { code: SupportedLocale }) {
  if (code === 'zh-TW') {
    return (
      <Image
        src="/flags/tw.svg"
        alt=""
        width={16}
        height={12}
        className="h-3 w-4 shrink-0 rounded-[1px] object-cover"
        aria-hidden
      />
    );
  }

  return (
    <span className="shrink-0 text-base leading-none" aria-hidden>
      {FLAG_BY_LOCALE[code]}
    </span>
  );
}

export const LanguageSubmenu = forwardRef<HTMLDivElement, { onSelect?: () => void }>(
  function LanguageSubmenu({ onSelect }, ref) {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  return (
    <div
      ref={ref}
      className="scroll-contained scrollbar-thin max-h-[min(280px,40vh)] py-1"
    >
      {SUPPORTED_LOCALES.map((loc) => {
        const selected = locale === loc.code;

        return (
          <button
            key={loc.code}
            type="button"
            aria-current={selected ? 'true' : undefined}
            onClick={() => {
              setLocale(loc.code);
              onSelect?.();
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-text-secondary hover:bg-background hover:text-text-primary',
              selected && 'font-medium text-text-primary',
            )}
          >
            <LocaleFlag code={loc.code} />
            <span className="min-w-0 flex-1 text-left">{loc.nativeLabel}</span>
            {selected && <Check className="h-4 w-4 shrink-0 text-brand-blue" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
},
);
