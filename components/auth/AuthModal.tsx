'use client';

import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';
import { SimpleWalletConnect } from './SimpleWalletConnect';
import { AuthTermsFooter } from './AuthTermsFooter';
import { AuthModalStepper } from './AuthModalStepper';
import { RegisterKycStep } from './RegisterKycStep';
import { RegisterDoneStep } from './RegisterDoneStep';
import { markAuthWelcomeDismissed } from '@/lib/authWelcome';

export function AuthModal() {
  const { t } = useTranslation();
  const {
    activeModal,
    authModal,
    authWelcomeAutoPending,
    closeAuthModal,
    setAuthModalStep,
    setToast,
  } = useUiStore();
  const isOpen = activeModal === 'auth';
  const { isAuthenticated } = useAuthStore();
  const prevAuth = useRef(isAuthenticated);

  const { mode, step } = authModal;
  const isSignup = mode === 'signup';
  const isWalletStep = step === 'wallet';

  useEffect(() => {
    if (!isOpen) {
      prevAuth.current = isAuthenticated;
      return;
    }

    if (isAuthenticated && !prevAuth.current) {
      markAuthWelcomeDismissed();

      if (isSignup && isWalletStep) {
        setAuthModalStep('kyc');
      } else if (!isSignup) {
        const kycStatus = useAuthStore.getState().user?.kycStatus;
        if (kycStatus && kycStatus !== 'APPROVED') {
          setToast({ message: t('auth.kycLoginReminder'), type: 'info' });
        }
        closeAuthModal();
      }
    }

    prevAuth.current = isAuthenticated;
  }, [
    isAuthenticated,
    isOpen,
    isWalletStep,
    isSignup,
    closeAuthModal,
    setAuthModalStep,
    setToast,
    t,
  ]);

  const handleClose = () => {
    closeAuthModal({ dismissWelcome: authWelcomeAutoPending });
  };

  const renderWalletStep = () => (
    <>
      <SimpleWalletConnect />
      <AuthTermsFooter />
    </>
  );

  const renderBody = () => {
    if (isWalletStep) {
      return renderWalletStep();
    }

    if (isSignup && step === 'kyc') {
      return <RegisterKycStep onSubmitted={() => setAuthModalStep('done')} />;
    }

    if (isSignup && step === 'done') {
      return <RegisterDoneStep />;
    }

    return renderWalletStep();
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none">
          <div className="relative max-h-[90vh] w-full max-w-[420px] scroll-contained rounded-2xl border border-border bg-card p-6 pt-10 shadow-xl animate-in fade-in slide-in-from-top-2">
            <Dialog.Close
              className="absolute right-4 top-4 z-10 rounded-lg p-1 text-text-secondary transition hover:bg-background hover:text-text-primary"
              aria-label={t('common.dismiss')}
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            {isSignup && !isWalletStep && <AuthModalStepper current={step} />}

            <div key={step} className="auth-content-switch">
              {renderBody()}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
