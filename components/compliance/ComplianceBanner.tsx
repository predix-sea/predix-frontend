'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { canTrade } from '@/lib/compliance';
import { useTranslation } from '@/hooks/useTranslation';

export function ComplianceBanner() {
  const { t } = useTranslation();
  const { compliance, user } = useAuthStore();
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

  if (!canTrade(compliance, !!kycApproved)) {
    return (
      <div className="rounded-lg border border-predix-warning/50 bg-predix-warning/10 p-4 text-sm text-predix-warning">
        <p className="font-medium">{t('compliance.kycRequiredTitle')}</p>
        <p className="mt-1 text-predix-muted">{t('compliance.kycRequiredBody')}</p>
      </div>
    );
  }

  return null;
}
