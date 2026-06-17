'use client';

import { SUPPORTED_LOCALES } from '@/lib/i18n/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5 text-brand-blue"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.333a1 1 0 0 1-1.435-.01L3.29 9.78a1 1 0 1 1 1.42-1.408l3.135 3.182 6.53-6.61a1 1 0 0 1 1.43 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguagePicker() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h2 className="text-sm font-semibold text-text-primary">{t('settings.language')}</h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SUPPORTED_LOCALES.map((item) => {
          const selected = locale === item.code;
          return (
            <button
              key={item.code}
              type="button"
              aria-pressed={selected}
              aria-label={`${item.nativeLabel}, ${item.englishLabel}`}
              onClick={() => setLocale(item.code)}
              className={cn(
                'relative rounded-xl border bg-card p-4 text-left shadow-card transition',
                selected
                  ? 'border-brand-blue ring-2 ring-brand-blue/20'
                  : 'border-border hover:border-brand-blue/20 hover:shadow-card-hover',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-text-primary">{item.nativeLabel}</p>
                  <p className="mt-0.5 text-sm text-text-secondary">{item.englishLabel}</p>
                </div>
                {selected && (
                  <span className="shrink-0" aria-hidden>
                    <CheckIcon />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-text-secondary">{t('settings.languageHint')}</p>
    </section>
  );
}
