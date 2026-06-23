'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

function LoginRedirect() {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUiStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (isAuthenticated) {
      router.replace(redirect);
      return;
    }

    router.replace('/');
    openAuthModal(mode);
  }, [isAuthenticated, mode, openAuthModal, redirect, router]);

  return null;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirect />
    </Suspense>
  );
}
