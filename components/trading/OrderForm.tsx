'use client';

import { useEffect, useState } from 'react';
import { OutcomeSelector } from './OutcomeSelector';
import { ComplianceBanner } from '@/components/compliance/ComplianceBanner';
import { validateOrderForm } from '@/lib/orderValidation';
import { canTrade } from '@/lib/compliance';
import { useAuthStore } from '@/stores/authStore';
import { useTradingStore } from '@/stores/tradingStore';
import { usePlaceOrder } from '@/hooks/useOrders';
import { mapApiError } from '@/services/bffClient';
import { useTranslation } from '@/hooks/useTranslation';
import type { Market, OrderSide, OrderType } from '@/types';
import { cn } from '@/lib/cn';

interface OrderFormProps {
  market: Market;
  selectedOutcomeId?: string;
  onOutcomeChange?: (id: string) => void;
}

const SIDE_KEYS: Record<OrderSide, string> = {
  BUY: 'trading.buy',
  SELL: 'trading.sell',
};

const TYPE_KEYS: Record<OrderType, string> = {
  LIMIT: 'trading.limit',
  MARKET: 'trading.market',
};

export function OrderForm({ market, selectedOutcomeId, onOutcomeChange }: OrderFormProps) {
  const { t } = useTranslation();
  const [internalOutcomeId, setInternalOutcomeId] = useState(market.outcomes[0]?.id ?? '');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const outcomeId = selectedOutcomeId ?? internalOutcomeId;
  const setOutcomeId = onOutcomeChange ?? setInternalOutcomeId;

  const limitPrice = useTradingStore((s) => s.limitPrice);
  const bookSide = useTradingStore((s) => s.bookSide);

  useEffect(() => {
    if (!selectedOutcomeId && market.outcomes[0]?.id) {
      setInternalOutcomeId(market.outcomes[0].id);
    }
  }, [market.id, market.outcomes, selectedOutcomeId]);

  useEffect(() => {
    if (limitPrice) {
      setPrice(limitPrice);
      setType('LIMIT');
    }
    if (bookSide) {
      setSide(bookSide);
    }
  }, [limitPrice, bookSide]);

  const { compliance, user, isAuthenticated } = useAuthStore();
  const kycApproved = user?.kycStatus === 'APPROVED';
  const tradingAllowed = canTrade(compliance, !!kycApproved) && isAuthenticated;

  const placeOrder = usePlaceOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateOrderForm({ size, price, type });
    if (!validation.valid) {
      setFormError(t(validation.errors[0]));
      return;
    }

    if (!outcomeId) {
      setFormError(t('trading.selectOutcome'));
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
      className="rounded-xl border border-border bg-card p-4 shadow-card"
    >
      <h3 className="mb-4 text-sm font-medium text-text-primary">{t('trading.placeOrder')}</h3>
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
                  ? 'bg-yes/10 text-yes'
                  : 'bg-no/10 text-no'
                : 'bg-background text-text-secondary',
            )}
          >
            {t(SIDE_KEYS[s])}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {(['LIMIT', 'MARKET'] as OrderType[]).map((orderType) => (
          <button
            key={orderType}
            type="button"
            disabled={!tradingAllowed}
            onClick={() => setType(orderType)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-xs font-medium',
              type === orderType
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'bg-background text-text-secondary',
            )}
          >
            {t(TYPE_KEYS[orderType])}
          </button>
        ))}
      </div>

      <label className="mb-2 block text-xs text-text-secondary">{t('trading.outcome')}</label>
      <OutcomeSelector
        outcomes={market.outcomes}
        selectedId={outcomeId}
        onSelect={setOutcomeId}
        disabled={!tradingAllowed}
      />

      <label className="mb-1 mt-4 block text-xs text-text-secondary">{t('trading.sizeShares')}</label>
      <input
        type="number"
        step="any"
        min="0"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        disabled={!tradingAllowed}
        className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
        placeholder="0.00"
      />

      {type === 'LIMIT' && (
        <>
          <label className="mb-1 block text-xs text-text-secondary">{t('trading.priceRange')}</label>
          <input
            type="number"
            step="any"
            min="0"
            max="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={!tradingAllowed}
            className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
            placeholder="0.50"
          />
        </>
      )}

      {formError && <p className="mb-2 text-sm text-no">{formError}</p>}
      {placeOrder.isError && (
        <p className="mb-2 text-sm text-no">{mapApiError(placeOrder.error).message}</p>
      )}
      {placeOrder.isSuccess && (
        <p className="mb-2 text-sm text-yes">{t('trading.orderSubmitted')}</p>
      )}

      <button
        type="submit"
        disabled={!tradingAllowed || placeOrder.isPending}
        className="w-full rounded-md bg-brand-blue py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeOrder.isPending
          ? t('trading.submitting')
          : tradingAllowed
            ? t('trading.submitOrder')
            : t('trading.tradingDisabled')}
      </button>

      {!isAuthenticated && (
        <p className="mt-2 text-center text-xs text-text-secondary">
          <a href="/login" className="text-brand-blue underline">
            {t('trading.connectToTrade')}
          </a>{' '}
          {t('trading.connectToTradeSuffix')}
        </p>
      )}
    </form>
  );
}
