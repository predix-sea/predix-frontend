export interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isOkxWallet?: boolean;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      providers?: Eip1193Provider[];
    };
    okxwallet?: Eip1193Provider;
  }
}

export function getMetaMaskProvider(): Eip1193Provider | null {
  if (typeof window === 'undefined') return null;

  const { ethereum, okxwallet } = window;
  if (!ethereum && !okxwallet) return null;

  if (ethereum?.providers?.length) {
    const metamask = ethereum.providers.find((p) => p.isMetaMask && !p.isOkxWallet);
    if (metamask) return metamask;
  }

  if (ethereum?.isMetaMask && !ethereum.isOkxWallet) {
    return ethereum;
  }

  return null;
}

export function getOkxProvider(): Eip1193Provider | null {
  if (typeof window === 'undefined') return null;

  if (window.okxwallet) {
    return window.okxwallet;
  }

  const { ethereum } = window;
  if (!ethereum) return null;

  if (ethereum.isOkxWallet) {
    return ethereum;
  }

  if (ethereum.providers?.length) {
    const okx = ethereum.providers.find((p) => p.isOkxWallet);
    if (okx) return okx;
  }

  return null;
}
