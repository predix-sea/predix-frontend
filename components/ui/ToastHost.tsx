'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';

export function ToastHost() {
  const toast = useUiStore((s) => s.toast);
  const setToast = useUiStore((s) => s.setToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-20 left-1/2 z-[200] -translate-x-1/2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 md:bottom-8',
        toast.type === 'error' && 'bg-no text-white',
        toast.type === 'success' && 'bg-yes text-white',
        toast.type === 'info' && 'border border-border bg-card text-text-primary',
      )}
    >
      {toast.message}
    </div>
  );
}
