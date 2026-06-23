'use client';

import type { OrderBook } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { buildOrderBookDepth, type DepthRow } from '@/lib/orderBookDepth';
import { formatUsd } from '@/lib/format';
import { useTradingStore } from '@/stores/tradingStore';
import { mapApiError } from '@/services/bffClient';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';

function DepthRowButton({
  row,
  maxSize,
  onSelect,
}: {
  row: DepthRow;
  maxSize: number;
  onSelect: (row: DepthRow) => void;
}) {
  const barPct = (row.size / maxSize) * 100;
  const isBid = row.side === 'bid';

  return (
    <button
      type="button"
      onClick={() => onSelect(row)}
      className="relative grid w-full grid-cols-3 gap-2 px-1 py-1 text-left font-mono text-xs transition hover:bg-background/80"
    >
      <span
        className={cn(
          'pointer-events-none absolute inset-y-0',
          isBid ? 'left-0 bg-yes/12' : 'right-0 bg-no/12',
        )}
        style={{ width: `${barPct}%` }}
        aria-hidden
      />
      <span className={cn('relative z-10', isBid ? 'text-yes' : 'text-no')}>
        {(row.price * 100).toFixed(1)}¢
      </span>
      <span className="relative z-10 text-right text-text-primary">{row.size.toFixed(0)}</span>
      <span className="relative z-10 text-right text-text-secondary">{formatUsd(row.total)}</span>
    </button>
  );
}

function SpreadRow({ spread, label }: { spread?: number; label: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-y border-border bg-background/60 px-1 py-2 text-center text-xs text-text-secondary">
      <span className="col-span-3 font-medium">
        {label}{' '}
        <span className="font-mono text-text-primary">
          {spread !== undefined ? `${(spread * 100).toFixed(1)}¢` : '—'}
        </span>
      </span>
    </div>
  );
}

function SummaryBar({
  bestBid,
  bestAsk,
  spread,
  labels,
}: {
  bestBid?: number;
  bestAsk?: number;
  spread?: number;
  labels: { bestBid: string; bestAsk: string; spread: string };
}) {
  return (
    <div className="mb-3 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs">
      <div>
        <p className="text-text-secondary">{labels.bestBid}</p>
        <p className="font-mono font-semibold text-yes">
          {bestBid !== undefined ? `${(bestBid * 100).toFixed(1)}¢` : '—'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-text-secondary">{labels.bestAsk}</p>
        <p className="font-mono font-semibold text-no">
          {bestAsk !== undefined ? `${(bestAsk * 100).toFixed(1)}¢` : '—'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-text-secondary">{labels.spread}</p>
        <p className="font-mono font-semibold text-text-primary">
          {spread !== undefined ? `${(spread * 100).toFixed(1)}¢` : '—'}
        </p>
      </div>
    </div>
  );
}

function ColumnHeader({
  labels,
}: {
  labels: { price: string; shares: string; total: string };
}) {
  return (
    <div className="mb-1 grid grid-cols-3 gap-2 px-1 text-xs font-medium text-text-secondary">
      <span>{labels.price}</span>
      <span className="text-right">{labels.shares}</span>
      <span className="text-right">{labels.total}</span>
    </div>
  );
}

export function OrderBookPanel({
  orderbook,
  isLoading,
  isError,
  error,
  embedded,
}: {
  orderbook?: OrderBook;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  embedded?: boolean;
}) {
  const { t } = useTranslation();
  const setFromOrderBook = useTradingStore((s) => s.setFromOrderBook);

  const handleSelect = (row: DepthRow) => {
    setFromOrderBook(row.price, row.side === 'ask' ? 'BUY' : 'SELL');
  };

  if (isLoading) {
    return (
      <div className="flex h-56 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    const message = mapApiError(error).message;
    return (
      <div className="flex h-56 flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-medium text-no">{t('trading.loadOrderBookError')}</p>
        <p className="mt-1 text-xs text-text-secondary">{message}</p>
      </div>
    );
  }

  if (!orderbook || (!orderbook.bids.length && !orderbook.asks.length)) {
    return (
      <div className="flex h-56 flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-medium text-text-primary">{t('trading.orderBookEmpty')}</p>
        <p className="mt-1 text-xs text-text-secondary">{t('trading.orderBookEmptyHint')}</p>
      </div>
    );
  }

  const depth = buildOrderBookDepth(orderbook);

  const content = (
    <>
      {orderbook.isMock && (
        <p className="mb-2 text-center text-xs text-text-secondary">{t('trading.mockOrderBook')}</p>
      )}
      <SummaryBar
        bestBid={depth.bestBid}
        bestAsk={depth.bestAsk}
        spread={depth.spread}
        labels={{
          bestBid: t('trading.bestBid'),
          bestAsk: t('trading.bestAsk'),
          spread: t('trading.spread'),
        }}
      />
      <ColumnHeader
        labels={{
          price: t('trading.priceCents'),
          shares: t('trading.sharesCol'),
          total: t('trading.totalUsd'),
        }}
      />
      <div className="max-h-80 scroll-contained">
        {depth.asks.map((row) => (
          <DepthRowButton
            key={`ask-${row.price}`}
            row={row}
            maxSize={depth.maxSize}
            onSelect={handleSelect}
          />
        ))}
        <SpreadRow spread={depth.spread} label={t('trading.spread')} />
        {depth.bids.map((row) => (
          <DepthRowButton
            key={`bid-${row.price}`}
            row={row}
            maxSize={depth.maxSize}
            onSelect={handleSelect}
          />
        ))}
      </div>
      {orderbook.lastTradePrice !== undefined && (
        <p className="mt-3 text-center text-xs text-text-secondary">
          {t('trading.lastTrade')}{' '}
          <span className="font-mono font-medium text-text-primary">
            {(orderbook.lastTradePrice * 100).toFixed(1)}¢
          </span>
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h3 className="mb-3 text-sm font-medium text-text-secondary">{t('trading.tabOrderBook')}</h3>
      {content}
    </div>
  );
}
