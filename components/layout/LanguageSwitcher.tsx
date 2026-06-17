'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  SUPPORTED_LOCALES,
  getLocaleDefinition,
  type SupportedLocale,
} from '@/lib/i18n/locales';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM4.332 8.03a6.009 6.009 0 0 1 4.668-3.03 5.98 5.98 0 0 1 2.664.627 6.009 6.009 0 0 0-7.332 2.403Zm8.668 0a6.009 6.009 0 0 0-7.332-2.403 5.98 5.98 0 0 1 2.664-.627 6.009 6.009 0 0 1 4.668 3.03ZM10 16.5c-1.58 0-3.01-.55-4.15-1.47a6.009 6.009 0 0 0 8.3 0A6.98 6.98 0 0 1 10 16.5Zm5.82-4.47a6.009 6.009 0 0 0-1.47-4.15A6.98 6.98 0 0 1 16.5 10c0 1.58-.55 3.01-1.47 4.15a6.009 6.009 0 0 0 1.47 4.15A6.98 6.98 0 0 1 10 3.5c1.58 0 3.01.55 4.15 1.47a6.009 6.009 0 0 0-1.47 4.15A6.98 6.98 0 0 1 10 16.5c-1.58 0-3.01-.55-4.15-1.47Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const current = getLocaleDefinition(locale);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectLocale = (code: SupportedLocale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={t('common.language')}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-border bg-card text-xs font-medium text-text-primary transition',
          'hover:border-brand-blue/20 hover:text-brand-blue',
          'h-8 px-2 sm:px-2.5',
        )}
      >
        <GlobeIcon className="h-3.5 w-3.5 text-text-secondary sm:hidden" />
        <span className="min-w-[1.25rem] tabular-nums">{current.shortLabel}</span>
        <ChevronIcon
          className={cn(
            'hidden h-3.5 w-3.5 text-text-secondary transition sm:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t('common.language')}
          className="absolute right-0 z-50 mt-1 min-w-[10.5rem] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-card"
        >
          {SUPPORTED_LOCALES.map((item) => {
            const selected = locale === item.code;
            return (
              <li key={item.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectLocale(item.code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition',
                    selected
                      ? 'bg-brand-blue/8 font-medium text-brand-blue'
                      : 'text-text-primary hover:bg-background',
                  )}
                >
                  <span>{item.nativeLabel}</span>
                  <span className="text-xs text-text-secondary">{item.shortLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
