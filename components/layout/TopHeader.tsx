'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchInput, type SearchInputHandle } from '@/components/ui/SearchInput';
import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { useMarketFilterStore } from '@/stores/marketFilterStore';
import { shortenAddress } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';

export function TopHeader() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isAuthenticated, walletAddress, compliance } = useAuthStore();
  const { query, setQuery } = useMarketFilterStore();
  const searchRef = useRef<SearchInputHandle>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (pathname === '/compliance-blocked') return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-8xl items-center gap-4 px-4 md:px-6 lg:px-8 xl:gap-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-text-primary transition hover:text-brand-blue"
        >
          PrediX
        </Link>

        <div className="mx-auto hidden min-w-0 flex-1 md:block md:max-w-xl lg:max-w-2xl">
          <SearchInput
            ref={searchRef}
            value={query}
            onChange={setQuery}
            placeholder={t('markets.searchPlaceholder')}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-brand-blue transition hover:text-brand-blue/80 sm:inline"
              >
                {t('nav.login')}
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-blue/90 sm:px-4 sm:text-sm"
              >
                {t('nav.signup')}
              </Link>
            </>
          ) : (
            <>
              {compliance === 'KYC_REQUIRED' && (
                <Badge variant="paused" className="hidden sm:inline-flex">
                  {t('header.kycRequired')}
                </Badge>
              )}
              {walletAddress && (
                <span className="max-w-[5.5rem] truncate rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-text-secondary sm:max-w-none sm:px-3">
                  {shortenAddress(walletAddress)}
                </span>
              )}
            </>
          )}
          <HamburgerMenu />
        </div>
      </div>

      <div className="border-t border-border px-4 pb-2 pt-2 md:hidden md:px-6">
        <SearchInput
          ref={searchRef}
          value={query}
          onChange={setQuery}
          placeholder={t('markets.searchPlaceholder')}
        />
      </div>
    </header>
  );
}
