import { cn } from '@/lib/cn';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-predix-border border-t-predix-accent',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
