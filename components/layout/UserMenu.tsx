'use client';

import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';
import { authService } from '@/services/authService';
import { shortenAddress } from '@/lib/format';

export function UserMenu() {
  const { t } = useTranslation();
  const { walletAddress, user, compliance, logout } = useAuthStore();
  const openAuthModalAtKyc = useUiStore((s) => s.openAuthModalAtKyc);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    logout();
  };

  const kycStatus = user?.kycStatus ?? 'PENDING';
  const kycApproved = kycStatus === 'APPROVED';
  const needsKyc = compliance === 'KYC_REQUIRED' || !kycApproved;

  const initials = walletAddress
    ? walletAddress.slice(2, 4).toUpperCase()
    : '?';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5 transition hover:border-brand-blue/30"
          aria-label={walletAddress ? shortenAddress(walletAddress) : 'Account'}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue/10 text-xs font-semibold text-brand-blue">
            {initials}
          </span>
          {walletAddress && (
            <span className="hidden max-w-[5.5rem] truncate font-mono text-xs text-text-secondary sm:inline sm:max-w-none">
              {shortenAddress(walletAddress)}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          {walletAddress && (
            <div className="border-b border-border px-3 py-2">
              <p className="font-mono text-xs text-text-secondary">{shortenAddress(walletAddress)}</p>
            </div>
          )}

          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-primary outline-none hover:bg-background"
            >
              <Settings className="h-4 w-4 text-text-secondary" />
              {t('header.settings')}
            </Link>
          </DropdownMenu.Item>

          {needsKyc ? (
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-600 outline-none hover:bg-background"
              onSelect={(e) => {
                e.preventDefault();
                openAuthModalAtKyc();
              }}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {t('auth.completeKyc')}
            </DropdownMenu.Item>
          ) : (
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
              <span className="text-xs text-green-600">{t('auth.kycApproved')}</span>
            </div>
          )}

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-no outline-none hover:bg-background"
            onSelect={(e) => {
              e.preventDefault();
              void handleLogout();
            }}
          >
            <LogOut className="h-4 w-4" />
            {t('nav.disconnect')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
