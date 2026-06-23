'use client';

import { generateSparklinePoints } from '@/lib/mockActivityFeed';
import { cn } from '@/lib/cn';

interface MarketSparklineProps {
  marketId: string;
  positive?: boolean;
  className?: string;
}

export function MarketSparkline({ marketId, positive = true, className }: MarketSparklineProps) {
  const points = generateSparklinePoints(marketId);
  const width = 64;
  const height = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-7 w-16', className)}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={positive ? 'var(--color-yes)' : 'var(--color-no)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}
