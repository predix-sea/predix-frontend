import Link from 'next/link';
import type { Market } from '@/types';
import { MarketStatusBadge } from './MarketStatusBadge';
import { formatCountdown, formatUsd } from '@/lib/format';

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link
      href={`/market/${market.id}`}
      className="group block rounded-xl border border-predix-border bg-predix-surface p-5 transition hover:border-predix-accent/50 hover:shadow-lg hover:shadow-predix-accent/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-predix-accent">
          {market.title}
        </h3>
        <MarketStatusBadge status={market.status} />
      </div>
      {market.category && (
        <p className="mt-2 text-xs uppercase tracking-wide text-predix-muted">{market.category}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-predix-muted">
          Vol <span className="text-white">{formatUsd(market.volume)}</span>
        </span>
        <span className="text-predix-muted">
          Ends <span className="text-white">{formatCountdown(market.closesAt)}</span>
        </span>
      </div>
      {market.outcomes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {market.outcomes.slice(0, 4).map((o) => (
            <span
              key={o.id}
              className="rounded-md bg-predix-bg px-2 py-1 text-xs text-predix-muted"
            >
              {o.label}
              {o.probability !== undefined && ` · ${(o.probability * 100).toFixed(0)}%`}
            </span>
          ))}
          {market.outcomes.length > 4 && (
            <span className="text-xs text-predix-muted">+{market.outcomes.length - 4} more</span>
          )}
        </div>
      )}
    </Link>
  );
}
