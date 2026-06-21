'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { canTrade } from '@/lib/compliance';
import { useTranslation } from '@/hooks/useTranslation';

export function ComplianceBanner() {
  const { t } = useTranslation();
  const { compliance, user, isAuthenticated } = useAuthStore();
  const openAuthModalAtKyc = useUiStore((s) => s.openAuthModalAtKyc);
  const kycApproved = user?.kycStatus === 'APPROVED';

  if (compliance === 'CN_BLOCKED') {
    return (
      <div className="rounded-lg border border-predix-danger/50 bg-predix-danger/10 p-4 text-sm text-predix-danger">
        {t('compliance.regionBlocked')}{' '}
        <Link href="/compliance-blocked" className="underline">
          {t('compliance.learnMore')}
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!canTrade(compliance, !!kycApproved)) {
    return (
      <div className="rounded-lg border border-predix-warning/50 bg-predix-warning/10 p-4 text-sm text-predix-warning">
        <p className="font-medium">{t('compliance.kycRequiredTitle')}</p>
        <p className="mt-1 text-predix-muted">{t('compliance.kycRequiredBody')}</p>
        <button
          type="button"
          onClick={openAuthModalAtKyc}
          className="mt-3 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-blue/90"
        >
          {t('auth.completeKyc')}
        </button>
      </div>
    );
  }

  return null;
}
