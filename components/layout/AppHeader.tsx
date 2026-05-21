'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { shortenAddress } from '@/lib/format';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/', label: 'Markets' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/orders', label: 'Orders' },
];

export function AppHeader() {
  const pathname = usePathname();
  const { isAuthenticated, walletAddress, compliance } = useAuthStore();

  if (pathname === '/compliance-blocked') return null;

  return (
    <header className="sticky top-0 z-50 border-b border-predix-border bg-predix-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-predix-accent">
          PrediX
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm transition-colors hover:text-predix-accent',
                pathname === item.href ? 'text-predix-accent' : 'text-predix-muted',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {compliance === 'KYC_REQUIRED' && (
            <span className="hidden text-xs text-predix-warning sm:inline">KYC Required</span>
          )}
          {isAuthenticated && walletAddress ? (
            <span className="rounded-md bg-predix-surface px-3 py-1.5 font-mono text-xs text-predix-muted">
              {shortenAddress(walletAddress)}
            </span>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-predix-accent px-4 py-1.5 text-sm font-medium text-predix-bg"
            >
              Connect
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
