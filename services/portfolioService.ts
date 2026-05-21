import { marketService } from './marketService';
import { bffRequest } from './bffClient';
import type { Balance, Position } from '@/types';

export const portfolioService = {
  balances: async (userId: string) => {
    const data = await bffRequest<Record<string, unknown>>(
      `/api/v1/custody/balances?userId=${encodeURIComponent(userId)}`,
    );
    const balances = (data.balances as Record<string, unknown>[] | undefined) ?? [data];
    return balances.map(
      (b, i): Balance => ({
        asset: String(b.asset ?? 'USDC'),
        available: Number(b.available ?? b.free ?? 0),
        locked: Number(b.locked ?? 0),
        total: Number(b.total ?? b.available ?? 0),
      }),
    );
  },

  positionsForMarkets: async (marketIds: string[], userId: string): Promise<Position[]> => {
    const results = await Promise.all(
      marketIds.map((id) => marketService.positions(id, userId).catch(() => [])),
    );
    return results.flat();
  },
};
