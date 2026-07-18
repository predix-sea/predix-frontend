'use client';

import { useQuery } from '@tanstack/react-query';
import type { CtfPosition } from '@/types';
import { fetchCtfPositions } from '@/services/ctfService';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function CtfPositionsPanel({
  conditionId,
  marketId,
}: {
  conditionId?: string;
  marketId?: string;
}) {
  const { t } = useTranslation();
  const { user, walletAddress, accessToken } = useAuthStore();
  const userId = user?.walletAddress ?? walletAddress ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['ctf-positions', userId, conditionId, marketId],
    queryFn: () =>
      fetchCtfPositions({
        userId,
        conditionId,
        marketId,
        token: accessToken,
      }),
    enabled: true,
  });

  const rows: CtfPosition[] = data ?? [];

  return (
    <section className="mb-8">
      <h2 className="mb-1 text-sm font-medium text-predix-muted">{t('portfolio.ctfTitle')}</h2>
      <p className="mb-3 text-xs text-predix-muted">{t('portfolio.ctfHint')}</p>
      {isLoading ? (
        <LoadingSpinner />
      ) : !rows.length ? (
        <p className="text-sm text-predix-muted">{t('portfolio.ctfEmpty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-predix-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-predix-border text-predix-muted">
                <th className="px-3 py-2 font-medium">{t('portfolio.colMarket')}</th>
                <th className="px-3 py-2 font-medium">{t('portfolio.ctfCondition')}</th>
                <th className="px-3 py-2 font-medium text-right">{t('trading.yes')}</th>
                <th className="px-3 py-2 font-medium text-right">{t('trading.no')}</th>
                <th className="px-3 py-2 font-medium">{t('portfolio.ctfSource')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.conditionId} className="border-b border-predix-border/50">
                  <td className="px-3 py-3">{r.marketTitle ?? r.marketId ?? '—'}</td>
                  <td className="max-w-[12rem] truncate px-3 py-3 font-mono text-xs text-predix-muted">
                    {r.conditionId}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-emerald-400">{r.yesBalance}</td>
                  <td className="px-3 py-3 text-right font-mono text-predix-danger">{r.noBalance}</td>
                  <td className="px-3 py-3 text-xs text-predix-muted">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
