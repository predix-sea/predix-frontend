'use client';

import type { Market } from '@/types';
import { cn } from '@/lib/cn';
import { NewsletterCard } from './NewsletterCard';
import { ActivityFeedCard } from './ActivityFeedCard';

interface RightRailProps {
  markets: Market[];
  className?: string;
  sticky?: boolean;
}

export function RightRail({ markets, className, sticky = true }: RightRailProps) {
  return (
    <aside className={className}>
      <div
        className={cn(
          'flex flex-col gap-4',
          sticky && 'sticky top-24 max-h-[calc(100vh-8rem)]',
        )}
      >
        <NewsletterCard className="shrink-0" />
        <ActivityFeedCard markets={markets} className="min-h-0 flex-1" />
      </div>
    </aside>
  );
}
