import { bffRequest } from './bffClient';

/** Placeholder for deposit/withdraw flows — Phase 2 */
export const custodyService = {
  deposit: (payload: Record<string, unknown>) =>
    bffRequest<Record<string, unknown>>('/api/v1/custody/deposits', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  withdraw: (payload: Record<string, unknown>) =>
    bffRequest<Record<string, unknown>>('/api/v1/custody/withdrawals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
