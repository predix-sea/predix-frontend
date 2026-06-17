'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SearchInputHandle {
  focus: () => void;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(function SearchInput(
  { value, onChange, placeholder, className, debounceMs = 300 },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState(value);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs, onChange, value]);

  return (
    <div role="search" className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
      />
    </div>
  );
});
