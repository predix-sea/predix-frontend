'use client';

import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';
import type { Outcome } from '@/types';

interface OutcomeSelectorProps {
  outcomes: Outcome[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

function outcomeStyle(label: string, selected: boolean): string {
  const lower = label.toLowerCase();
  if (lower === 'yes') {
    return selected
      ? 'border-yes bg-yes/15 text-yes'
      : 'border-yes/40 bg-yes/5 text-yes hover:border-yes hover:bg-yes/10';
  }
  if (lower === 'no') {
    return selected
      ? 'border-no bg-no/15 text-no'
      : 'border-no/50 bg-no/5 text-no hover:border-no hover:bg-no/10';
  }
  if (selected) {
    return 'border-brand-blue bg-brand-blue/10 text-brand-blue';
  }
  return 'border-border bg-background text-text-secondary hover:border-border';
}

function displayOutcomeLabel(label: string, t: (key: string) => string): string {
  const lower = label.toLowerCase();
  if (lower === 'yes') return t('trading.yes');
  if (lower === 'no') return t('trading.no');
  return label;
}

export function OutcomeSelector({
  outcomes,
  selectedId,
  onSelect,
  disabled,
}: OutcomeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${Math.min(outcomes.length, 3)}, 1fr)` }}
    >
      {outcomes.map((outcome) => (
        <button
          key={outcome.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(outcome.id)}
          className={cn(
            'rounded-lg border px-3 py-2.5 text-sm font-medium transition',
            outcomeStyle(outcome.label, selectedId === outcome.id),
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span>{displayOutcomeLabel(outcome.label, t)}</span>
          {outcome.price !== undefined && (
            <span className="mt-1 block text-xs opacity-80">
              {(outcome.price * 100).toFixed(1)}¢
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
