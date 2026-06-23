'use client';

import { useEffect, useState } from 'react';
import { ComplianceBanner } from '@/components/compliance/ComplianceBanner';
import { validateOrderForm } from '@/lib/orderValidation';
import { canTrade } from '@/lib/compliance';
import {
  formatCentsPrecise,
  getNoOutcomeId,
  getNoPrice,
  getYesOutcomeId,
  getYesPrice,
} from '@/lib/marketPricing';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useTradingStore } from '@/stores/tradingStore';
import { usePlaceOrder } from '@/hooks/useOrders';
import { mapApiError } from '@/services/bffClient';
import { useTranslation } from '@/hooks/useTranslation';
import type { Market, OrderBook, OrderSide, OrderType } from '@/types';
import { cn } from '@/lib/cn';

interface TradingPanelProps {
  market: Market;
  orderbook?: OrderBook;
  selectedOutcomeId: string;
  onOutcomeChange: (id: string) => void;
  className?: string;
}

const SHARE_DELTAS = [-100, -10, 10, 100] as const;
const PRICE_STEP = 0.01;

export function TradingPanel({
  market,
  orderbook,
  selectedOutcomeId,
  onOutcomeChange,
  className,
}: TradingPanelProps) {
  const { t } = useTranslation();
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const limitPrice = useTradingStore((s) => s.limitPrice);
  const bookSide = useTradingStore((s) => s.bookSide);

  const yesOutcomeId = getYesOutcomeId(market);
  const noOutcomeId = getNoOutcomeId(market);
  const yesPrice = getYesPrice(market, orderbook) ?? 0.5;
  const noPrice = getNoPrice(market, orderbook) ?? 0.5;

  useEffect(() => {
    if (limitPrice) {
      setPrice(limitPrice);
      setType('LIMIT');
    }
    if (bookSide) {
      setSide(bookSide);
    }
  }, [limitPrice, bookSide]);

  useEffect(() => {
    if (!price && selectedOutcomeId) {
      const isYes = selectedOutcomeId === yesOutcomeId;
      setPrice((isYes ? yesPrice : noPrice).toFixed(2));
    }
  }, [selectedOutcomeId, yesOutcomeId, yesPrice, noPrice, price]);

  const { compliance, user, isAuthenticated } = useAuthStore();
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const kycApproved = user?.kycStatus === 'APPROVED';
  const complianceAllowsTrade = canTrade(compliance, !!kycApproved);
  const formLocked = isAuthenticated && !complianceAllowsTrade;
  const tradingAllowed = isAuthenticated && complianceAllowsTrade;

  const placeOrder = usePlaceOrder();

  const numericSize = parseFloat(size) || 0;
  const numericPrice = parseFloat(price) || (selectedOutcomeId === yesOutcomeId ? yesPrice : noPrice);
  const totalCost = numericSize * numericPrice;
  const toWin = side === 'BUY' ? numericSize * (1 - numericPrice) : numericSize * numericPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isAuthenticated) {
      openAuthModal('signup');
      setFormError(t('trading.loginRequired'));
      return;
    }

    if (!complianceAllowsTrade) {
      return;
    }

    const validation = validateOrderForm({ size, price, type });
    if (!validation.valid) {
      setFormError(t(validation.errors[0]));
      return;
    }

    if (!selectedOutcomeId) {
      setFormError(t('trading.selectOutcome'));
      return;
    }

    try {
      await placeOrder.mutateAsync({
        marketId: market.id,
        outcomeId: selectedOutcomeId,
        side,
        type,
        size: parseFloat(size),
        price: type === 'LIMIT' ? parseFloat(price) : undefined,
      });
      setSize('');
    } catch (err) {
      setFormError(mapApiError(err).message);
    }
  };

  const adjustPrice = (delta: number) => {
    const current = parseFloat(price) || numericPrice;
    const next = Math.min(0.99, Math.max(0.01, current + delta));
    setPrice(next.toFixed(2));
  };

  const adjustSize = (delta: number) => {
    const current = parseFloat(size) || 0;
    setSize(String(Math.max(0, current + delta)));
  };

  const submitLabel = placeOrder.isPending
    ? t('trading.submitting')
    : !isAuthenticated
      ? t('trading.signUpToTrade')
      : tradingAllowed
        ? t('trading.trade')
        : t('trading.tradingDisabled');

  const selectYes = () => {
    if (yesOutcomeId) {
      onOutcomeChange(yesOutcomeId);
      setPrice(yesPrice.toFixed(2));
    }
  };

  const selectNo = () => {
    if (noOutcomeId) {
      onOutcomeChange(noOutcomeId);
      setPrice(noPrice.toFixed(2));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-sm lg:shadow-card',
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-1 rounded-lg bg-background p-0.5">
          {(['BUY', 'SELL'] as OrderSide[]).map((s) => (
            <button
              key={s}
              type="button"
              disabled={formLocked}
              onClick={() => setSide(s)}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-semibold transition',
                side === s
                  ? 'bg-text-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {s === 'BUY' ? t('trading.buy') : t('trading.sell')}
            </button>
          ))}
        </div>
        <select
          value={type}
          disabled={formLocked}
          onChange={(e) => setType(e.target.value as OrderType)}
          className="rounded-lg border border-border bg-background px-2 py-2 text-xs font-medium text-text-primary"
          aria-label={t('trading.orderType')}
        >
          <option value="LIMIT">{t('trading.limit')}</option>
          <option value="MARKET">{t('trading.market')}</option>
        </select>
      </div>

      {(yesOutcomeId || noOutcomeId) && (
        <div className="mb-4 flex gap-2">
          {yesOutcomeId && (
            <button
              type="button"
              disabled={formLocked}
              onClick={selectYes}
              className={cn(
                'flex flex-1 flex-col items-center rounded-xl border-2 px-3 py-3 transition',
                selectedOutcomeId === yesOutcomeId
                  ? 'border-yes bg-yes text-white'
                  : 'border-yes/40 bg-card text-yes hover:bg-yes/5',
              )}
            >
              <span className="text-sm font-semibold">{t('trading.yes')}</span>
              <span className="mt-0.5 font-mono text-base tabular-nums">
                {formatCentsPrecise(yesPrice)}
              </span>
            </button>
          )}
          {noOutcomeId && (
            <button
              type="button"
              disabled={formLocked}
              onClick={selectNo}
              className={cn(
                'flex flex-1 flex-col items-center rounded-xl border-2 px-3 py-3 transition',
                selectedOutcomeId === noOutcomeId
                  ? 'border-no bg-no text-white'
                  : 'border-no/40 bg-card text-no hover:bg-no/5',
              )}
            >
              <span className="text-sm font-semibold">{t('trading.no')}</span>
              <span className="mt-0.5 font-mono text-base tabular-nums">
                {formatCentsPrecise(noPrice)}
              </span>
            </button>
          )}
        </div>
      )}

      {type === 'LIMIT' && (
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            {t('trading.limitPrice')}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={formLocked}
              onClick={() => adjustPrice(-PRICE_STEP)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-lg text-text-secondary hover:bg-card"
              aria-label="-"
            >
              −
            </button>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={formLocked}
              className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-center font-mono text-sm tabular-nums text-text-primary"
            />
            <button
              type="button"
              disabled={formLocked}
              onClick={() => adjustPrice(PRICE_STEP)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-lg text-text-secondary hover:bg-card"
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          {t('trading.shares')}
        </label>
        <input
          type="number"
          step="any"
          min="0"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          disabled={formLocked}
          className="mb-2 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm tabular-nums text-text-primary"
          placeholder="0"
        />
        <div className="flex flex-wrap gap-1.5">
          {SHARE_DELTAS.map((delta) => (
            <button
              key={delta}
              type="button"
              disabled={formLocked}
              onClick={() => adjustSize(delta)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-text-secondary hover:border-brand-blue/30 hover:text-brand-blue"
            >
              {delta > 0 ? `+${delta}` : delta}
            </button>
          ))}
        </div>
      </div>

      {numericSize > 0 && (
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-text-secondary">
            {t('trading.total')}{' '}
            <span className="font-mono font-medium tabular-nums text-text-primary">
              ${totalCost.toFixed(2)}
            </span>
          </span>
          <span className="text-text-secondary">
            {t('trading.toWin')}{' '}
            <span className="font-mono font-medium tabular-nums text-yes">
              ${toWin.toFixed(2)}
            </span>
          </span>
        </div>
      )}

      <ComplianceBanner compact />

      {formError && <p className="mb-2 text-sm text-no">{formError}</p>}
      {placeOrder.isError && (
        <p className="mb-2 text-sm text-no">{mapApiError(placeOrder.error).message}</p>
      )}
      {placeOrder.isSuccess && (
        <p className="mb-2 text-sm text-yes">{t('trading.orderSubmitted')}</p>
      )}

      <button
        type="submit"
        disabled={(isAuthenticated && !tradingAllowed) || placeOrder.isPending}
        className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white transition hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
