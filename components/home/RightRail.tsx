'use client';

import type { Market } from '@/types';
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
      <div className={sticky ? 'sticky top-24 space-y-4' : 'space-y-4'}>
        <NewsletterCard />
        <ActivityFeedCard markets={markets} />
      </div>
    </aside>
  );
}
