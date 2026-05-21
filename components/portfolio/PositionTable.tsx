import type { Position } from '@/types';
import { formatUsd } from '@/lib/format';

export function PositionTable({ positions }: { positions: Position[] }) {
  if (!positions.length) {
    return <p className="py-8 text-center text-sm text-predix-muted">No positions yet</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-predix-border text-predix-muted">
            <th className="px-3 py-2 font-medium">Market</th>
            <th className="px-3 py-2 font-medium">Outcome</th>
            <th className="px-3 py-2 font-medium text-right">Size</th>
            <th className="px-3 py-2 font-medium text-right">Avg</th>
            <th className="px-3 py-2 font-medium text-right">PnL</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
            <tr key={p.id} className="border-b border-predix-border/50">
              <td className="px-3 py-3">{p.marketTitle ?? p.marketId}</td>
              <td className="px-3 py-3 text-predix-muted">{p.outcomeLabel ?? p.outcomeId}</td>
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
