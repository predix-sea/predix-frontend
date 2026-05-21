'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useSiweLogin } from '@/hooks/useSiweLogin';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function LoginContent() {
  const { connectAndLogin, loading, error, clearError } = useSiweLogin();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-bold text-white">Connect Wallet</h1>
      <p className="mt-2 text-predix-muted">
        Sign in with Ethereum (SIWE) via MetaMask. Your keys never leave your wallet.
      </p>

      <div className="mt-8 rounded-xl border border-predix-border bg-predix-surface p-6">
        {error && (
          <div className="mb-4 rounded-md bg-predix-danger/10 p-3 text-sm text-predix-danger">
            {error}
            <button type="button" className="ml-2 underline" onClick={clearError}>
              Dismiss
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => void connectAndLogin()}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-predix-accent py-3 text-sm font-semibold text-predix-bg disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              Signing in…
            </>
          ) : (
            'Connect MetaMask'
          )}
        </button>

        <ol className="mt-6 space-y-2 text-xs text-predix-muted">
          <li>1. Request nonce from PrediX BFF</li>
          <li>2. Sign SIWE message in your wallet</li>
          <li>3. Verify signature and receive session token</li>
        </ol>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  );
}
