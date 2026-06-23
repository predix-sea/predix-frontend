'use client';

export function PickMarketIllustration() {
  return (
    <div className="flex h-full items-center justify-center gap-4 px-6">
      <div className="w-[140px] rounded-xl border border-border bg-card p-3 shadow-card">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-blue/15" />
          <div className="h-2 flex-1 rounded bg-border" />
        </div>
        <p className="mb-3 line-clamp-2 text-[10px] font-semibold leading-tight text-text-primary">
          Will SEA GDP grow 5% in 2026?
        </p>
        <div className="flex gap-1.5">
          <span className="rounded-md border border-yes/30 px-2 py-1 text-[10px] font-medium text-yes">
            Yes
          </span>
          <span className="rounded-md border border-no/30 px-2 py-1 text-[10px] font-medium text-no">
            No
          </span>
        </div>
      </div>

      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="var(--color-yes)"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 34 * 0.5} ${2 * Math.PI * 34}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-text-primary">
          50%
        </span>
      </div>
    </div>
  );
}

export function TradeIllustration() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <div className="mb-4 w-full max-w-[220px] rounded-xl border border-border bg-card p-4 shadow-card">
        <label className="mb-1 block text-[10px] font-medium text-text-secondary">Amount</label>
        <div className="mb-4 flex items-center rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-text-secondary">$</span>
          <span className="ml-1 text-xl font-bold tabular-nums text-text-primary">100</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-lg bg-yes py-2.5 text-sm font-semibold text-white"
            tabIndex={-1}
          >
            Buy Yes
          </button>
          <button
            type="button"
            className="rounded-lg bg-no py-2.5 text-sm font-semibold text-white"
            tabIndex={-1}
          >
            Buy No
          </button>
        </div>
      </div>
      <p className="text-[10px] text-text-secondary">USDC · Wallet · Card</p>
    </div>
  );
}

export function RedeemIllustration() {
  return (
    <div className="flex h-full items-center justify-center px-8">
      <div className="w-full max-w-[240px] rounded-xl border border-border bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between border-b border-dashed border-border pb-3">
          <span className="text-xs font-semibold text-text-primary">Receipt</span>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
            Resolved
          </span>
        </div>
        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex justify-between">
            <span>Position</span>
            <span className="font-medium text-text-primary">Yes × 250</span>
          </div>
          <div className="flex justify-between">
            <span>Payout</span>
            <span className="font-medium text-text-primary">$1.00 / share</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-brand-blue/10 px-3 py-3">
          <span className="text-sm font-semibold text-brand-blue">Cash Out</span>
          <span className="text-2xl font-bold tabular-nums text-brand-blue">$250</span>
        </div>
      </div>
    </div>
  );
}
