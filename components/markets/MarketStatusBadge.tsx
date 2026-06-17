'use client';

import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';
import type { MarketStatus } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  CLOSED: 'border border-slate-200 bg-slate-50 text-slate-600',
  RESOLVED: 'border border-blue-200 bg-blue-50 text-blue-700',
  PAUSED: 'border border-amber-200 bg-amber-50 text-amber-700',
};

const STATUS_LABEL_KEYS: Record<string, string> = {
  OPEN: 'status.open',
  CLOSED: 'status.closed',
  RESOLVED: 'status.resolved',
  PAUSED: 'status.paused',
};

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  const { t } = useTranslation();
  const style =
    STATUS_STYLES[status] ?? 'border border-border bg-background text-text-secondary';
  const labelKey = STATUS_LABEL_KEYS[status];
  const label = labelKey ? t(labelKey) : status;

  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', style)}>
      {label}
    </span>
  );
}
