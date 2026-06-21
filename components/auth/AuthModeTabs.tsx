'use client';

import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';
import type { AuthModalMode } from '@/stores/uiStore';

interface AuthModeTabsProps {
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
}

const MODES: AuthModalMode[] = ['login', 'signup'];

export function AuthModeTabs({ mode, onModeChange }: AuthModeTabsProps) {
  const { t } = useTranslation();

  return (
    <div
      className="mb-6 flex rounded-lg border border-border bg-background p-1"
      role="tablist"
      aria-label={t('auth.welcomeTitle')}
    >
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          onClick={() => {
            if (mode !== m) onModeChange(m);
          }}
          className={cn(
            'flex-1 rounded-md py-2 text-sm font-semibold transition-colors duration-150',
            mode === m
              ? 'bg-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {m === 'login' ? t('nav.login') : t('nav.signup')}
        </button>
      ))}
    </div>
  );
}
