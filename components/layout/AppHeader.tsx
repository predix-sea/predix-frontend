'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { shortenAddress } from '@/lib/format';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { cn } from '@/lib/cn';

export function AppHeader() {
  const pathname = usePathname();
  const { isAuthenticated, walletAddress, compliance } = useAuthStore();
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const { t } = useTranslation();

  const nav = [
    { href: '/', label: t('nav.markets') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/orders', label: t('nav.orders') },
  ];

  if (pathname === '/compliance-blocked') return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-text-primary">
          PrediX
        </Link>
        <nav className="flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-blue',
                pathname === item.href ? 'text-brand-blue' : 'text-text-secondary',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <Link
            href="/settings"
            className={cn(
              'inline-flex items-center justify-center rounded-md border border-border p-2 text-text-secondary transition hover:border-brand-blue/20 hover:text-brand-blue',
              pathname === '/settings' && 'border-brand-blue/30 text-brand-blue',
            )}
            aria-label={t('header.settings')}
            title={t('header.settings')}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path
                fillRule="evenodd"
                d="M8.34 1.804a1 1 0 0 1 .98 0l1.518.855a1 1 0 0 0 .98 0l1.518-.855a1 1 0 0 1 1.32.435l.855 1.518a1 1 0 0 0 .435.435l1.518.855a1 1 0 0 1 0 1.32l-.855 1.518a1 1 0 0 0 0 .98l.855 1.518a1 1 0 0 1-.435 1.32l-1.518.855a1 1 0 0 0-.98 0l-1.518.855a1 1 0 0 1-1.32-.435l-.855-1.518a1 1 0 0 0-.98 0l-1.518.855a1 1 0 0 1-1.32-.435l-.855-1.518a1 1 0 0 0-.435-.435l-1.518-.855a1 1 0 0 1 0-1.32l.855-1.518a1 1 0 0 0 .435-.435l1.518-.855a1 1 0 0 1 .435-1.32l.855-1.518a1 1 0 0 1 .98-.435ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          {compliance === 'KYC_REQUIRED' && (
            <span className="hidden text-xs text-predix-warning sm:inline">
              {t('header.kycRequired')}
            </span>
          )}
          {isAuthenticated && walletAddress ? (
            <span className="max-w-[5.5rem] truncate rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-text-secondary sm:max-w-none sm:px-3">
              {shortenAddress(walletAddress)}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="rounded-md bg-brand-blue px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-blue/90 sm:px-4 sm:text-sm"
            >
              {t('header.connect')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
