'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { getSubcategories, formatCount } from '@/lib/marketSubcategories';
import { getCategoryByValue } from '@/lib/marketCategories';
import { useMarketFilterStore } from '@/stores/marketFilterStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { Market } from '@/types';

interface SidebarProps {
  markets: Market[];
  className?: string;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarContent({
  markets,
  category,
  subcategory,
  onSelect,
}: {
  markets: Market[];
  category: string;
  subcategory: string;
  onSelect: (value: string) => void;
}) {
  const { t } = useTranslation();
  const catMeta = getCategoryByValue(category);
  const subs = getSubcategories(category);

  const counts = subs.map((sub) => {
    const count = markets.filter((m) => {
      const catMatch =
        category === 'hot' ||
        !category ||
        m.category?.toLowerCase() === category ||
        (category === 'hot' && !m.category);
      if (!catMatch) return false;
      if (!sub.value) return true;
      const title = m.title.toLowerCase();
      const desc = m.description?.toLowerCase() ?? '';
      const needle = sub.value.replace('-', ' ');
      return title.includes(needle) || desc.includes(needle) || m.category?.includes(sub.value);
    }).length;
    return { ...sub, count };
  });

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-3 px-3 text-sm font-semibold text-text-primary">
        {catMeta ? t(catMeta.labelKey) : t('category.hot')}
      </h2>
      <ul className="space-y-0.5 px-2">
        {counts.map((sub) => {
          const active = subcategory === sub.value;
          return (
            <li key={sub.value || 'all'}>
              <button
                type="button"
                onClick={() => onSelect(sub.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                  active
                    ? 'bg-background font-medium text-text-primary'
                    : 'text-text-secondary hover:bg-background/60 hover:text-text-primary',
                )}
              >
                <span>{t(sub.labelKey)}</span>
                <span className="tabular-nums text-text-secondary">{formatCount(sub.count)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({ markets, className, mobile, open, onOpenChange }: SidebarProps) {
  const { category, subcategory, setSubcategory, setSidebarOpen } = useMarketFilterStore();

  const handleSelect = (value: string) => {
    setSubcategory(value);
    if (mobile) {
      setSidebarOpen(false);
      onOpenChange?.(false);
    }
  };

  if (mobile) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(280px,85vw)] border-r border-border bg-card p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-top-2">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-sm font-semibold text-text-primary">Filters</Dialog.Title>
              <Dialog.Close className="rounded-lg p-1 text-text-secondary hover:bg-background">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <SidebarContent
              markets={markets}
              category={category}
              subcategory={subcategory}
              onSelect={handleSelect}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <aside
      className={cn(
        'hidden w-[240px] shrink-0 border-r border-border bg-card lg:block xl:w-[240px]',
        className,
      )}
    >
      <div className="sticky top-[7.5rem] max-h-[calc(100vh-7.5rem)] overflow-y-auto py-4">
        <SidebarContent
          markets={markets}
          category={category}
          subcategory={subcategory}
          onSelect={handleSelect}
        />
      </div>
    </aside>
  );
}
