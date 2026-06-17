'use client';

import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useBookmarkStore } from '@/stores/bookmarkStore';

export function BookmarkButton({
  marketId,
  className,
  onClick,
}: {
  marketId: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const { isBookmarked, toggle } = useBookmarkStore();
  const active = isBookmarked(marketId);

  return (
    <button
      type="button"
      aria-label={active ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
        toggle(marketId);
      }}
      className={cn(
        'rounded-lg p-1.5 text-text-secondary transition hover:bg-background hover:text-brand-blue',
        active && 'text-brand-blue',
        className,
      )}
    >
      <Bookmark className={cn('h-4 w-4', active && 'fill-current')} />
    </button>
  );
}
