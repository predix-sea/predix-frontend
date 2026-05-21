import { cn } from '@/lib/cn';
import type { MarketStatus } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-emerald-500/20 text-emerald-400',
  CLOSED: 'bg-slate-500/20 text-slate-400',
  RESOLVED: 'bg-blue-500/20 text-blue-400',
  PAUSED: 'bg-amber-500/20 text-amber-400',
};

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  const style = STATUS_STYLES[status] ?? 'bg-predix-border text-predix-muted';
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium uppercase', style)}>
      {status}
    </span>
  );
}
