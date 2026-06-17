'use client';

import { useQuery } from '@tanstack/react-query';
import { PositionTable } from '@/components/portfolio/PositionTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useMarkets } from '@/hooks/useMarkets';
import { portfolioService } from '@/services/portfolioService';
import { useAuthStore } from '@/stores/authStore';
import { formatUsd } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';

export default function PortfolioPage() {
  const { t } = useTranslation();
  const { user, walletAddress } = useAuthStore();
  const userId = user?.walletAddress ?? walletAddress ?? '';

  const { data: markets } = useMarkets();
  const marketIds = (markets ?? []).map((m) => m.id).slice(0, 20);

  const { data: positions, isLoading: posLoading } = useQuery({
    queryKey: ['portfolio-positions', userId, marketIds],
    queryFn: () => portfolioService.positionsForMarkets(marketIds, userId),
    enabled: !!userId && marketIds.length > 0,
  });

  const { data: balances, isLoading: balLoading } = useQuery({
    queryKey: ['portfolio-balances', userId],
    queryFn: () => portfolioService.balances(userId),
    enabled: !!userId,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">{t('portfolio.title')}</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-predix-muted">{t('portfolio.balances')}</h2>
        {balLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {(balances ?? []).map((b) => (
              <div
                key={b.asset}
                className="rounded-lg border border-predix-border bg-predix-surface p-4"
              >
                <p className="text-xs text-predix-muted">{b.asset}</p>
                <p className="mt-1 text-xl font-mono text-white">{formatUsd(b.available)}</p>
                <p className="text-xs text-predix-muted">
                  {t('portfolio.locked', { amount: formatUsd(b.locked) })}
                </p>
              </div>
            ))}
            {!balances?.length && (
              <p className="text-sm text-predix-muted">{t('portfolio.noBalanceData')}</p>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-predix-muted">{t('portfolio.positions')}</h2>
        {posLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <PositionTable positions={positions ?? []} />
        )}
      </section>
    </div>
  );
}
