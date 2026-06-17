'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Wallet, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname === '/compliance-blocked') return null;

  const tabs = [
    { href: '/', label: t('nav.markets'), icon: LayoutGrid },
    { href: '/portfolio', label: t('nav.portfolio'), icon: Wallet },
    { href: '/orders', label: t('nav.orders'), icon: ListOrdered },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden"
    >
      <div className="flex items-stretch justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition',
                active ? 'text-brand-blue' : 'text-text-secondary',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
