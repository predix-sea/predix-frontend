'use client';

import { cn } from '@/lib/cn';
import type { Outcome } from '@/types';

interface OutcomeSelectorProps {
  outcomes: Outcome[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function OutcomeSelector({
  outcomes,
  selectedId,
  onSelect,
  disabled,
}: OutcomeSelectorProps) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(outcomes.length, 3)}, 1fr)` }}>
      {outcomes.map((outcome) => (
        <button
          key={outcome.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(outcome.id)}
          className={cn(
            'rounded-lg border px-3 py-2.5 text-sm font-medium transition',
            selectedId === outcome.id
              ? 'border-predix-accent bg-predix-accent/10 text-predix-accent'
              : 'border-predix-border bg-predix-bg text-predix-muted hover:border-predix-muted',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span>{outcome.label}</span>
          {outcome.price !== undefined && (
            <span className="mt-1 block text-xs opacity-80">{(outcome.price * 100).toFixed(1)}¢</span>
          )}
        </button>
      ))}
    </div>
  );
}
