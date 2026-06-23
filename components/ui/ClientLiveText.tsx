'use client';

import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/cn';

interface ClientLiveTextProps {
  children: () => string;
  placeholder?: string;
  className?: string;
}

/** Renders a stable placeholder during SSR; live text after hydration. */
export function ClientLiveText({
  children,
  placeholder = '—',
  className,
}: ClientLiveTextProps) {
  const mounted = useMounted();

  return <span className={cn(className)}>{mounted ? children() : placeholder}</span>;
}
