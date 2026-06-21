import { beforeEach, describe, expect, it } from 'vitest';
import { getMetaMaskProvider, getOkxProvider } from '@/lib/walletProviders';

describe('walletProviders', () => {
  beforeEach(() => {
    // @ts-expect-error test cleanup
    delete window.ethereum;
    // @ts-expect-error test cleanup
    delete window.okxwallet;
  });

  it('prefers MetaMask provider when multiple injected wallets exist', () => {
    const metamask = { isMetaMask: true, request: async () => null };
    const okx = { isOkxWallet: true, request: async () => null };
    window.ethereum = { providers: [okx, metamask], request: async () => null };

    expect(getMetaMaskProvider()).toBe(metamask);
    expect(getOkxProvider()).toBe(okx);
  });

  it('detects OKX via window.okxwallet', () => {
    const okx = { isOkxWallet: true, request: async () => null };
    window.okxwallet = okx;

    expect(getOkxProvider()).toBe(okx);
  });
});
