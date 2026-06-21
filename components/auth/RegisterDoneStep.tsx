'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useUiStore } from '@/stores/uiStore';

export function RegisterDoneStep() {
  const { t } = useTranslation();
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  return (
    <div className="py-4 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30">
        <CheckCircle2 className="h-9 w-9 text-green-600" aria-hidden />
      </div>

      <h2 className="text-xl font-bold text-text-primary">{t('auth.accountCreated')}</h2>
      <p className="mt-2 text-sm text-text-secondary">{t('auth.accountCreatedHint')}</p>

      <Link
        href="/"
        onClick={closeAuthModal}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
      >
        {t('auth.startBrowsing')}
      </Link>
    </div>
  );
}
