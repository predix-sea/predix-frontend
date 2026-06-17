'use client';

import type { Position } from '@/types';
import { formatUsd } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';

function displayOutcomeLabel(label: string | undefined, t: (key: string) => string): string {
  if (!label) return '';
  const lower = label.toLowerCase();
  if (lower === 'yes') return t('trading.yes');
  if (lower === 'no') return t('trading.no');
  return label;
}

export function PositionTable({ positions }: { positions: Position[] }) {
  const { t } = useTranslation();

  if (!positions.length) {
    return <p className="py-8 text-center text-sm text-predix-muted">{t('portfolio.noPositions')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-predix-border text-predix-muted">
            <th className="px-3 py-2 font-medium">{t('portfolio.colMarket')}</th>
            <th className="px-3 py-2 font-medium">{t('portfolio.colOutcome')}</th>
            <th className="px-3 py-2 font-medium text-right">{t('portfolio.colSize')}</th>
            <th className="px-3 py-2 font-medium text-right">{t('portfolio.colAvg')}</th>
            <th className="px-3 py-2 font-medium text-right">{t('portfolio.colPnl')}</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.id} className="border-b border-predix-border/50">
              <td className="px-3 py-3">{p.marketTitle ?? p.marketId}</td>
              <td className="px-3 py-3 text-predix-muted">
                {displayOutcomeLabel(p.outcomeLabel, t) || p.outcomeId}
              </td>
              <td className="px-3 py-3 text-right font-mono">{p.size}</td>
              <td className="px-3 py-3 text-right font-mono">
                {p.avgPrice !== undefined ? `${(p.avgPrice * 100).toFixed(1)}¢` : '—'}
              </td>
              <td
                className={`px-3 py-3 text-right font-mono ${
                  (p.unrealizedPnl ?? 0) >= 0 ? 'text-emerald-400' : 'text-predix-danger'
                }`}
              >
                {p.unrealizedPnl !== undefined ? formatUsd(p.unrealizedPnl) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
