export const AUTH_WELCOME_DISMISSED_KEY = 'predix-auth-welcome-dismissed';

export const AUTH_WELCOME_DELAY_MS = 300;

export function markAuthWelcomeDismissed(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_WELCOME_DISMISSED_KEY, '1');
  }
}

export function shouldAutoShowAuthWelcome(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_AUTO_AUTH_WELCOME === 'false') return false;
  return !localStorage.getItem(AUTH_WELCOME_DISMISSED_KEY);
}

/** When true, auto-open auth welcome only (skip HowItWorks auto-open). */
export function isAuthWelcomeOnlyMode(): boolean {
  return process.env.NEXT_PUBLIC_AUTO_AUTH_WELCOME === 'true';
}
