'use client';

import { useState } from 'react';
import { OutcomeSelector } from './OutcomeSelector';
import { ComplianceBanner } from '@/components/compliance/ComplianceBanner';
import { validateOrderForm } from '@/lib/orderValidation';
import { canTrade } from '@/lib/compliance';
import { useAuthStore } from '@/stores/authStore';
import { usePlaceOrder } from '@/hooks/useOrders';
import { mapApiError } from '@/services/bffClient';
import type { Market, OrderSide, OrderType } from '@/types';
import { cn } from '@/lib/cn';

interface OrderFormProps {
  market: Market;
}

export function OrderForm({ market }: OrderFormProps) {
  const [outcomeId, setOutcomeId] = useState(market.outcomes[0]?.id ?? '');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { compliance, user, isAuthenticated } = useAuthStore();
  const kycApproved = user?.kycStatus === 'APPROVED';
  const tradingAllowed = canTrade(compliance, !!kycApproved) && isAuthenticated;

  const placeOrder = usePlaceOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateOrderForm({ size, price, type });
    if (!validation.valid) {
      setFormError(validation.errors[0]);
      return;
    }

    if (!outcomeId) {
      setFormError('Select an outcome');
      return;
    }

    try {
      await placeOrder.mutateAsync({
        marketId: market.id,
        outcomeId,
        side,
        type,
        size: parseFloat(size),
        price: type === 'LIMIT' ? parseFloat(price) : undefined,
      });
      setSize('');
      setPrice('');
    } catch (err) {
      setFormError(mapApiError(err).message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-predix-border bg-predix-surface p-4"
    >
      <h3 className="mb-4 text-sm font-medium text-white">Place Order</h3>
      <ComplianceBanner />

      <div className="mb-4 flex gap-2">
        {(['BUY', 'SELL'] as OrderSide[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={!tradingAllowed}
            onClick={() => setSide(s)}
            className={cn(
              'flex-1 rounded-md py-2 text-sm font-medium',
              side === s
                ? s === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-predix-danger/20 text-predix-danger'
                : 'bg-predix-bg text-predix-muted',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {(['LIMIT', 'MARKET'] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            disabled={!tradingAllowed}
            onClick={() => setType(t)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-medium',
              type === t ? 'bg-predix-accent/20 text-predix-accent' : 'bg-predix-bg text-predix-muted',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <label className="mb-2 block text-xs text-predix-muted">Outcome</label>
      <OutcomeSelector
        outcomes={market.outcomes}
        selectedId={outcomeId}
        onSelect={setOutcomeId}
        disabled={!tradingAllowed}
      />

      <label className="mb-1 mt-4 block text-xs text-predix-muted">Size (shares)</label>
      <input
        type="number"
        step="any"
        min="0"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        disabled={!tradingAllowed}
        className="mb-3 w-full rounded-md border border-predix-border bg-predix-bg px-3 py-2 text-sm text-white"
        placeholder="0.00"
      />

      {type === 'LIMIT' && (
        <>
          <label className="mb-1 block text-xs text-predix-muted">Price (0–1)</label>
          <input
            type="number"
            step="any"
            min="0"
            max="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={!tradingAllowed}
            className="mb-3 w-full rounded-md border border-predix-border bg-predix-bg px-3 py-2 text-sm text-white"
            placeholder="0.50"
          />
        </>
      )}

      {formError && <p className="mb-2 text-sm text-predix-danger">{formError}</p>}
      {placeOrder.isError && (
        <p className="mb-2 text-sm text-predix-danger">{mapApiError(placeOrder.error).message}</p>
      )}
      {placeOrder.isSuccess && (
        <p className="mb-2 text-sm text-emerald-400">Order submitted successfully</p>
      )}

      <button
        type="submit"
        disabled={!tradingAllowed || placeOrder.isPending}
        className="w-full rounded-md bg-predix-accent py-2.5 text-sm font-semibold text-predix-bg disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeOrder.isPending ? 'Submitting…' : tradingAllowed ? 'Submit Order' : 'Trading Disabled'}
      </button>

      {!isAuthenticated && (
        <p className="mt-2 text-center text-xs text-predix-muted">
          <a href="/login" className="text-predix-accent underline">
            Connect wallet
          </a>{' '}
          to trade
        </p>
      )}
    </form>
  );
}
