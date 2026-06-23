'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { canTrade } from '@/lib/compliance';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

export function ComplianceBanner({ compact }: { compact?: boolean } = {}) {
  const { t } = useTranslation();
  const { compliance, user, isAuthenticated } = useAuthStore();
  const openAuthModalAtKyc = useUiStore((s) => s.openAuthModalAtKyc);
  const kycApproved = user?.kycStatus === 'APPROVED';

  if (compliance === 'CN_BLOCKED') {
    return (
      <div
        className={cn(
          'rounded-lg border border-predix-danger/50 bg-predix-danger/10 text-predix-danger',
          compact ? 'mb-2 p-2 text-xs' : 'p-4 text-sm',
        )}
      >
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
      <div
        className={cn(
          'rounded-lg border border-predix-warning/50 bg-predix-warning/10 text-predix-warning',
          compact ? 'mb-2 p-2 text-xs' : 'p-4 text-sm',
        )}
      >
        <p className="font-medium">{t('compliance.kycRequiredTitle')}</p>
        {!compact && (
          <p className="mt-1 text-predix-muted">{t('compliance.kycRequiredBody')}</p>
        )}
        <button
          type="button"
          onClick={openAuthModalAtKyc}
          className={cn(
            'rounded-lg bg-brand-blue font-semibold text-white transition hover:bg-brand-blue/90',
            compact ? 'mt-1.5 px-2 py-1 text-xs' : 'mt-3 px-3 py-1.5 text-xs',
          )}
        >
          {t('auth.completeKyc')}
        </button>
      </div>
    );
  }

  return null;
}
