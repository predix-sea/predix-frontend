import { describe, expect, it, vi, beforeEach } from 'vitest';
import { bffRequest, mapApiError, setComplianceHandler, setTokenGetter } from '@/services/bffClient';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

describe('bffClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setTokenGetter(() => null);
    useUiStore.setState({ activeModal: 'none' });
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

  it('logs out and opens auth modal on 401 when a token was sent', async () => {
    setTokenGetter(() => 'stale-token');
    const logout = vi.spyOn(useAuthStore.getState(), 'logout');
    const openAuthModal = vi.spyOn(useUiStore.getState(), 'openAuthModal');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: { get: () => 'application/json' },
        json: async () => ({
          code: 'AUTH_INVALID_TOKEN',
          message: 'Session expired',
          traceId: 't0',
        }),
      }),
    );

    await expect(bffRequest('/api/v1/orders')).rejects.toMatchObject({ status: 401 });
    expect(logout).toHaveBeenCalled();
    expect(openAuthModal).toHaveBeenCalledWith('login');
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
