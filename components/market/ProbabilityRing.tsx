'use client';

import { cn } from '@/lib/cn';

interface ProbabilityRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export function ProbabilityRing({
  value,
  size = 56,
  strokeWidth = 4,
  className,
  label,
}: ProbabilityRingProps) {
  const pct = Math.round(Math.min(100, Math.max(0, value * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      aria-label={label ?? `${pct}% probability`}
      role="img"
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-yes)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums text-text-primary">
        {pct}%
      </span>
    </div>
  );
}
