import type { CtfPosition, CtfTimelineEvent } from '@/types';

const INDEXER_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_INDEXER_URL ?? '')
    : (process.env.INDEXER_URL ?? process.env.NEXT_PUBLIC_INDEXER_URL ?? '');

function useDemo(): boolean {
  return (process.env.NEXT_PUBLIC_CTF_USE_DEMO ?? 'true').toLowerCase() === 'true';
}

function demoPositions(marketId?: string): CtfPosition[] {
  return [
    {
      conditionId: '0xdemoConditionYesNo00000000000000000001',
      marketId: marketId ?? 'mkt-demo',
      marketTitle: 'Demo binary market (CTF)',
      yesBalance: '100.0',
      noBalance: '100.0',
      source: 'demo',
    },
  ];
}

/**
 * Fetch CTF-related timeline from indexer PrediX API (Phase 4).
 * When indexer is unset or fails, return demo rows if NEXT_PUBLIC_CTF_USE_DEMO=true.
 */
export async function fetchCtfTimeline(conditionId: string, token?: string | null): Promise<CtfTimelineEvent[]> {
  if (!INDEXER_BASE) {
    return [];
  }
  const url = `${INDEXER_BASE.replace(/\/$/, '')}/api/v1/markets/${encodeURIComponent(conditionId)}/timeline?limit=50`;
  const headers: HeadersInit = { Accept: 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Indexer timeline ${res.status}`);
  }
  const body = (await res.json()) as { events?: Array<Record<string, unknown>> };
  return (body.events ?? []).map((e) => ({
    eventType: String(e.eventType ?? ''),
    txHash: e.txHash ? String(e.txHash) : undefined,
    blockNumber: typeof e.blockNumber === 'number' ? e.blockNumber : undefined,
    conditionId: e.conditionId ? String(e.conditionId) : conditionId,
  }));
}

/**
 * MVP positions: demo until BFF exposes ERC-1155 balances; optionally enrich from indexer timeline presence.
 */
export async function fetchCtfPositions(opts: {
  userId?: string;
  conditionId?: string;
  marketId?: string;
  token?: string | null;
}): Promise<CtfPosition[]> {
  const { conditionId, marketId, token } = opts;

  if (conditionId && INDEXER_BASE) {
    try {
      const events = await fetchCtfTimeline(conditionId, token);
      const hasSplit = events.some((e) => e.eventType.includes('SPLIT') || e.eventType.includes('CTF_POSITION'));
      if (hasSplit || events.length > 0) {
        return [
          {
            conditionId,
            marketId,
            marketTitle: marketId,
            yesBalance: hasSplit ? '—' : '0',
            noBalance: hasSplit ? '—' : '0',
            source: 'indexer',
          },
        ];
      }
    } catch {
      /* fall through to demo */
    }
  }

  if (useDemo()) {
    return demoPositions(marketId);
  }
  return [];
}

export function ctfChainConfig() {
  return {
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? '80002'),
    ctfOpsAddress: process.env.NEXT_PUBLIC_CTF_OPS_ADDRESS ?? '',
    ctfAddress: process.env.NEXT_PUBLIC_CTF_ADDRESS ?? '',
    collateralToken: process.env.NEXT_PUBLIC_COLLATERAL_TOKEN ?? '',
  };
}
