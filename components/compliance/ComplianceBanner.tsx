'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { canTrade } from '@/lib/compliance';

export function ComplianceBanner() {
  const { compliance, user } = useAuthStore();
  const kycApproved = user?.kycStatus === 'APPROVED';

  if (compliance === 'CN_BLOCKED') {
    return (
      <div className="rounded-lg border border-predix-danger/50 bg-predix-danger/10 p-4 text-sm text-predix-danger">
        Access from your region is not permitted.{' '}
        <Link href="/compliance-blocked" className="underline">
          Learn more
        </Link>
      </div>
    );
  }

  if (!canTrade(compliance, !!kycApproved)) {
    return (
      <div className="rounded-lg border border-predix-warning/50 bg-predix-warning/10 p-4 text-sm text-predix-warning">
        <p className="font-medium">KYC verification required</p>
        <p className="mt-1 text-predix-muted">
          You can browse markets, but trading and fund actions are disabled until KYC is approved.
        </p>
      </div>
    );
  }

  return null;
}
