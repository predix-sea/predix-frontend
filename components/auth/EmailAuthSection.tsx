'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useUiStore } from '@/stores/uiStore';

export function EmailAuthSection() {
  const { t } = useTranslation();
  const setToast = useUiStore((s) => s.setToast);

  const showComingSoon = () =>
    setToast({ message: t('auth.comingSoon'), type: 'info' });

  return (
    <div className="relative rounded-xl border border-border bg-white">
      <input
        type="email"
        placeholder={t('auth.emailPlaceholder')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            showComingSoon();
          }
        }}
        className="w-full rounded-xl bg-transparent py-3 pl-3.5 pr-[5.5rem] text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
      />
      <button
        type="button"
        onClick={showComingSoon}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-brand-blue/15 px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/20"
      >
        {t('auth.continue')}
      </button>
    </div>
  );
}
