'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export function AuthTermsFooter() {
  const { t } = useTranslation();

  return (
    <p className="mt-4 text-center text-xs text-text-secondary">
      <Link href="/terms" className="transition hover:text-brand-blue">
        {t('auth.terms')}
      </Link>
      <span className="mx-1.5" aria-hidden>
        •
      </span>
      <Link href="/privacy" className="transition hover:text-brand-blue">
        {t('auth.privacy')}
      </Link>
    </p>
  );
}
