import { describe, expect, it, vi, beforeEach } from 'vitest';
import { bffRequest, mapApiError, setComplianceHandler } from '@/services/bffClient';

describe('bffClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('maps unknown errors', () => {
    const err = mapApiError(new Error('network'));
    expect(err.code).toBe('INTERNAL_ERROR');
    expect(err.message).toBe('network');
  });

  it('throws api error on non-OK envelope', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        headers: { get: () => 'application/json' },
        json: async () => ({
          code: 'COMPLIANCE_CN_BLOCKED',
          message: 'Blocked',
          traceId: 't1',
        }),
      }),
    );

    await expect(bffRequest('/api/v1/markets')).rejects.toMatchObject({
      code: 'COMPLIANCE_CN_BLOCKED',
    });
  });

  it('invokes compliance handler', async () => {
    const handler = vi.fn();
    setComplianceHandler(handler);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        headers: { get: () => 'application/json' },
        json: async () => ({
          code: 'COMPLIANCE_KYC_REQUIRED',
          message: 'KYC',
          traceId: 't2',
        }),
      }),
    );

    await expect(bffRequest('/api/v1/orders', { method: 'POST', body: '{}' })).rejects.toBeTruthy();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'COMPLIANCE_KYC_REQUIRED' }),
    );

    setComplianceHandler(null);
  });
});
