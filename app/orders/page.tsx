'use client';

import { useState } from 'react';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { mapApiError } from '@/services/bffClient';
import { canTrade } from '@/lib/compliance';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import type { OrderStatus } from '@/types';

const CANCELLABLE: OrderStatus[] = ['OPEN', 'PENDING', 'PARTIALLY_FILLED'];

const SIDE_KEYS: Record<string, string> = {
  BUY: 'trading.buy',
  SELL: 'trading.sell',
};

const TYPE_KEYS: Record<string, string> = {
  LIMIT: 'trading.limit',
  MARKET: 'trading.market',
};

const STATUS_KEYS: Record<string, string> = {
  OPEN: 'orders.statusOpen',
  FILLED: 'orders.statusFilled',
  CANCELLED: 'orders.statusCancelled',
  PENDING: 'orders.statusPending',
  PARTIALLY_FILLED: 'orders.statusPartiallyFilled',
};

function translateValue(value: string, keys: Record<string, string>, t: (key: string) => string) {
  const key = keys[value];
  return key ? t(key) : value;
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('');
  const { data: orders, isLoading, error } = useOrders();
  const cancelOrder = useCancelOrder();
  const { compliance, user } = useAuthStore();
  const tradingAllowed = canTrade(compliance, user?.kycStatus === 'APPROVED');

  const filtered = (orders ?? []).filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{t('orders.title')}</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-predix-border bg-predix-surface px-3 py-2 text-sm text-white"
        >
          <option value="">{t('orders.allStatuses')}</option>
          <option value="OPEN">{t('orders.statusOpen')}</option>
          <option value="FILLED">{t('orders.statusFilled')}</option>
          <option value="CANCELLED">{t('orders.statusCancelled')}</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && <p className="text-predix-danger">{t('orders.loadError')}</p>}

      <div className="overflow-x-auto rounded-xl border border-predix-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-predix-border bg-predix-surface text-predix-muted">
              <th className="px-4 py-3">{t('orders.colId')}</th>
              <th className="px-4 py-3">{t('orders.colMarket')}</th>
              <th className="px-4 py-3">{t('orders.colSide')}</th>
              <th className="px-4 py-3">{t('orders.colType')}</th>
              <th className="px-4 py-3 text-right">{t('orders.colSize')}</th>
              <th className="px-4 py-3 text-right">{t('orders.colPrice')}</th>
              <th className="px-4 py-3">{t('orders.colStatus')}</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-predix-border/50">
                <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}…</td>
                <td className="px-4 py-3">{order.marketId}</td>
                <td className="px-4 py-3">
                  {translateValue(order.side, SIDE_KEYS, t)}
                </td>
                <td className="px-4 py-3">
                  {translateValue(order.type, TYPE_KEYS, t)}
                </td>
                <td className="px-4 py-3 text-right font-mono">{order.size}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {order.price !== undefined
                    ? `${(order.price * 100).toFixed(1)}¢`
                    : t('trading.marketOrderAbbr')}
                </td>
                <td className="px-4 py-3">
                  {translateValue(order.status, STATUS_KEYS, t)}
                </td>
                <td className="px-4 py-3">
                  {tradingAllowed && CANCELLABLE.includes(order.status as OrderStatus) && (
                    <button
                      type="button"
                      onClick={() => void cancelOrder.mutateAsync(order.id)}
                      disabled={cancelOrder.isPending}
                      className="text-xs text-predix-danger hover:underline"
                    >
                      {t('orders.cancel')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && !filtered.length && (
          <p className="py-12 text-center text-predix-muted">{t('orders.noOrders')}</p>
        )}
      </div>

      {cancelOrder.isError && (
        <p className="mt-2 text-sm text-predix-danger">{mapApiError(cancelOrder.error).message}</p>
      )}
    </div>
  );
}
