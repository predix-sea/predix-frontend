'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { SessionBootstrap } from '@/features/auth/SessionBootstrap';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <SessionBootstrap />
          {children}
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
