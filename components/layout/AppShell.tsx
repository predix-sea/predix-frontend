'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { TopHeader } from './TopHeader';
import { CategoryNav } from './CategoryNav';
import { MobileNav } from './MobileNav';
import { GlobalModals } from './GlobalModals';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketsHome = pathname === '/';

  return (
    <>
      <TopHeader />
      {isMarketsHome && (
        <Suspense fallback={null}>
          <CategoryNav />
        </Suspense>
      )}
      <div
        className={cn(
          'pb-16 md:pb-0',
          !isMarketsHome && 'mx-auto min-h-[calc(100vh-3.5rem)] max-w-7xl px-4 py-6 md:px-6 lg:px-8',
        )}
      >
        {children}
      </div>
      <MobileNav />
      <GlobalModals />
    </>
  );
}
