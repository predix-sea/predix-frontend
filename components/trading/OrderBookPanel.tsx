'use client';

import type { OrderBook } from '@/types';
import { formatUsd } from '@/lib/format';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function OrderBookPanel({
  orderbook,
  isLoading,
}: {
  orderbook?: OrderBook;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-predix-border bg-predix-surface p-4">
      <h3 className="mb-3 text-sm font-medium text-predix-muted">Order Book</h3>
      {orderbook?.lastTradePrice !== undefined && (
        <p className="mb-3 text-center text-lg font-mono text-white">
          Last {(orderbook.lastTradePrice * 100).toFixed(1)}¢
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="mb-2 font-medium text-emerald-400">Bids</p>
          {(orderbook?.bids ?? []).slice(0, 8).map((b, i) => (
            <div key={`bid-${i}`} className="flex justify-between py-0.5 font-mono">
              <span className="text-emerald-400">{(b.price * 100).toFixed(1)}¢</span>
              <span className="text-predix-muted">{b.size}</span>
            </div>
          ))}
          {!orderbook?.bids?.length && <p className="text-predix-muted">No bids</p>}
        </div>
        <div>
          <p className="mb-2 font-medium text-predix-danger">Asks</p>
          {(orderbook?.asks ?? []).slice(0, 8).map((a, i) => (
            <div key={`ask-${i}`} className="flex justify-between py-0.5 font-mono">
              <span className="text-predix-danger">{(a.price * 100).toFixed(1)}¢</span>
              <span className="text-predix-muted">{a.size}</span>
            </div>
          ))}
          {!orderbook?.asks?.length && <p className="text-predix-muted">No asks</p>}
        </div>
      </div>
    </div>
  );
}
