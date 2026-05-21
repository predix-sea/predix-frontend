'use client';

import { useState } from 'react';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { mapApiError } from '@/services/bffClient';
import { canTrade } from '@/lib/compliance';
import { useAuthStore } from '@/stores/authStore';
import type { OrderStatus } from '@/types';

const CANCELLABLE: OrderStatus[] = ['OPEN', 'PENDING', 'PARTIALLY_FILLED'];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: orders, isLoading, error } = useOrders();
  const cancelOrder = useCancelOrder();
  const { compliance, user } = useAuthStore();
  const tradingAllowed = canTrade(compliance, user?.kycStatus === 'APPROVED');

  const filtered = (orders ?? []).filter((o) => !statusFilter || o.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-predix-border bg-predix-surface px-3 py-2 text-sm text-white"
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="FILLED">Filled</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="text-predix-danger">Failed to load orders. List endpoint may be pending on BFF.</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-predix-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-predix-border bg-predix-surface text-predix-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-predix-border/50">
                <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}…</td>
                <td className="px-4 py-3">{order.marketId}</td>
                <td className="px-4 py-3">{order.side}</td>
                <td className="px-4 py-3">{order.type}</td>
                <td className="px-4 py-3 text-right font-mono">{order.size}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {order.price !== undefined ? `${(order.price * 100).toFixed(1)}¢` : 'MKT'}
                </td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3">
                  {tradingAllowed && CANCELLABLE.includes(order.status) && (
                    <button
                      type="button"
                      onClick={() => void cancelOrder.mutateAsync(order.id)}
                      disabled={cancelOrder.isPending}
                      className="text-xs text-predix-danger hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && !filtered.length && (
          <p className="py-12 text-center text-predix-muted">No orders</p>
        )}
      </div>

      {cancelOrder.isError && (
        <p className="mt-2 text-sm text-predix-danger">{mapApiError(cancelOrder.error).message}</p>
      )}
    </div>
  );
}
