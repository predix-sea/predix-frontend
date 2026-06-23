'use client';

import { cn } from '@/lib/cn';

type BadgeVariant = 'open' | 'closed' | 'resolved' | 'paused' | 'default';

const variantClasses: Record<BadgeVariant, string> = {
  open: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  resolved: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  paused: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function statusToBadgeVariant(status: string): BadgeVariant {
  const s = status.toUpperCase();
  if (s === 'OPEN') return 'open';
  if (s === 'CLOSED') return 'closed';
  if (s === 'RESOLVED') return 'resolved';
  if (s === 'PAUSED') return 'paused';
  return 'default';
}
