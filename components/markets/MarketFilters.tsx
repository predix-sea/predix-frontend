'use client';

import { useMarketFilterStore } from '@/stores/marketFilterStore';

const STATUSES = ['', 'OPEN', 'CLOSED', 'RESOLVED'];
const CATEGORIES = ['', 'Politics', 'Sports', 'Crypto', 'Economics'];

export function MarketFilters() {
  const { status, category, query, setStatus, setCategory, setQuery } = useMarketFilterStore();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        placeholder="Search markets…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 rounded-lg border border-predix-border bg-predix-surface px-4 py-2 text-sm text-white placeholder:text-predix-muted"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-predix-border bg-predix-surface px-3 py-2 text-sm text-white"
      >
        {STATUSES.map((s) => (
          <option key={s || 'all'} value={s}>
            {s || 'All statuses'}
          </option>
        ))}
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-predix-border bg-predix-surface px-3 py-2 text-sm text-white"
      >
        {CATEGORIES.map((c) => (
          <option key={c || 'all'} value={c}>
            {c || 'All categories'}
          </option>
        ))}
      </select>
    </div>
  );
}
