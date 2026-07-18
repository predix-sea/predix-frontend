'use client';

import { useState } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { ctfChainConfig } from '@/services/ctfService';
import { useTranslation } from '@/hooks/useTranslation';

const OPS_ABI = [
  'function split(address collateral, bytes32 conditionId, uint256 amount) external',
];

/**
 * Amoy demo: wallet-signed PredixCtfOps.split (optional).
 * Requires NEXT_PUBLIC_CTF_OPS_ADDRESS + COLLATERAL + wallet on chain 80002.
 */
export function CtfSplitDemo({ conditionId }: { conditionId?: string }) {
  const { t } = useTranslation();
  const cfg = ctfChainConfig();
  const [amount, setAmount] = useState('1');
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState(false);

  if (!cfg.ctfOpsAddress || !cfg.collateralToken) {
    return (
      <p className="text-xs text-predix-muted">{t('portfolio.ctfSplitUnavailable')}</p>
    );
  }

  const onSplit = async () => {
    if (!conditionId || !conditionId.startsWith('0x')) {
      setStatus(t('portfolio.ctfNeedCondition'));
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      const eth = (window as unknown as { ethereum?: unknown }).ethereum;
      if (!eth) {
        setStatus(t('auth.metamaskNotFound'));
        return;
      }
      const provider = new BrowserProvider(eth as never);
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== cfg.chainId) {
        setStatus(t('portfolio.ctfWrongChain', { chainId: String(cfg.chainId) }));
        return;
      }
      const signer = await provider.getSigner();
      const ops = new Contract(cfg.ctfOpsAddress, OPS_ABI, signer);
      const value = parseUnits(amount || '0', 6);
      const tx = await ops.split(cfg.collateralToken, conditionId, value);
      setStatus(`${t('portfolio.ctfTxSent')} ${tx.hash}`);
      await tx.wait();
      setStatus(`${t('portfolio.ctfTxConfirmed')} ${tx.hash}`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-predix-border bg-predix-surface p-4">
      <h3 className="text-sm font-medium text-white">{t('portfolio.ctfSplitTitle')}</h3>
      <p className="mt-1 text-xs text-predix-muted">{t('portfolio.ctfSplitHint')}</p>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="text-xs text-predix-muted">
          {t('portfolio.ctfAmount')}
          <input
            className="mt-1 block w-28 rounded border border-predix-border bg-black/30 px-2 py-1 font-mono text-sm text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onSplit()}
          className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? t('portfolio.ctfSplitting') : t('portfolio.ctfSplit')}
        </button>
      </div>
      {status && <p className="mt-2 break-all text-xs text-predix-muted">{status}</p>}
    </div>
  );
}
