'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import {
  Trophy,
  DollarSign,
  Plug,
  Moon,
  ChevronRight,
  ChevronDown,
  LogOut,
  Wallet,
  ListOrdered,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { authService } from '@/services/authService';
import { LanguageSubmenu } from './LanguageSubmenu';

interface HamburgerMenuProps {
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HamburgerMenu({ mobile, open, onOpenChange }: HamburgerMenuProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const { isAuthenticated, logout } = useAuthStore();
  const { openHowItWorks, openAuthModal } = useUiStore();
  const [langOpen, setLangOpen] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    logout();
    setOpen(false);
  };

  const primaryItems = [
    { href: '/leaderboard', label: t('nav.leaderboard'), icon: Trophy, color: 'text-amber-500' },
    { href: '/rewards', label: t('nav.rewards'), icon: DollarSign, color: 'text-green-600' },
    { href: '/api', label: t('nav.api'), icon: Plug, color: 'text-fuchsia-600' },
  ];

  const secondaryItems = [
    { href: '/accuracy', label: t('nav.accuracy') },
    { href: '/status', label: t('nav.status') },
    { href: '/docs', label: t('nav.docs') },
    { href: '/help', label: t('nav.help') },
    { href: '/terms', label: t('nav.terms') },
  ];

  const menuContent = (
    <DropdownMenu.Content
      align="end"
      sideOffset={8}
      className={cn(
        'z-50 w-72 rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2',
        mobile && 'fixed inset-x-4 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto',
      )}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      <div className="py-2">
        <DropdownMenu.Item
          className="mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-primary outline-none hover:bg-background focus:bg-background sm:hidden"
          onSelect={(e) => {
            e.preventDefault();
            openHowItWorks();
            setOpen(false);
          }}
        >
          <Play className="h-4 w-4 text-brand-blue" aria-hidden />
          {t('nav.howItWorks')}
        </DropdownMenu.Item>

        {primaryItems.map(({ href, label, icon: Icon, color }) => (
          <DropdownMenu.Item key={href} asChild>
            <Link
              href={href}
              className="mx-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-text-primary outline-none hover:bg-background focus:bg-background"
              onClick={() => setOpen(false)}
            >
              <Icon className={cn('h-4 w-4', color)} aria-hidden />
              {label}
            </Link>
          </DropdownMenu.Item>
        ))}

        <div className="mx-2 flex items-center justify-between rounded-lg px-4 py-3 hover:bg-background">
          <div className="flex items-center gap-3 text-sm font-medium text-text-primary">
            <Moon className="h-4 w-4 text-brand-blue" aria-hidden />
            {t('nav.darkMode')}
          </div>
          <Switch.Root
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            className="relative h-5 w-9 rounded-full bg-border data-[state=checked]:bg-brand-blue"
            aria-label={t('nav.darkMode')}
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-card shadow transition-transform data-[state=checked]:translate-x-[18px]" />
          </Switch.Root>
        </div>

        <DropdownMenu.Separator className="my-2 h-px bg-border" />

        {!isAuthenticated && (
          <>
            <DropdownMenu.Item
              className="mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-brand-blue outline-none hover:bg-background"
              onSelect={(e) => {
                e.preventDefault();
                openAuthModal('login');
                setOpen(false);
              }}
            >
              {t('nav.login')}
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-text-primary outline-none hover:bg-background"
              onSelect={(e) => {
                e.preventDefault();
                openAuthModal('signup');
                setOpen(false);
              }}
            >
              {t('nav.signup')}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-2 h-px bg-border" />
          </>
        )}

        {isAuthenticated && (
          <>
            <DropdownMenu.Item asChild>
              <Link
                href="/portfolio"
                className="mx-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-text-secondary outline-none hover:bg-background hover:text-text-primary"
                onClick={() => setOpen(false)}
              >
                <Wallet className="h-4 w-4" aria-hidden />
                {t('nav.portfolio')}
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/orders"
                className="mx-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-text-secondary outline-none hover:bg-background hover:text-text-primary"
                onClick={() => setOpen(false)}
              >
                <ListOrdered className="h-4 w-4" aria-hidden />
                {t('nav.orders')}
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-text-secondary outline-none hover:bg-background hover:text-no"
              onSelect={(e) => {
                e.preventDefault();
                void handleLogout();
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {t('nav.disconnect')}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-2 h-px bg-border" />
          </>
        )}

        {secondaryItems.map(({ href, label }) => (
          <DropdownMenu.Item key={href} asChild>
            <Link
              href={href}
              className="mx-2 block rounded-lg px-4 py-2.5 text-sm text-text-secondary outline-none hover:bg-background hover:text-text-primary"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          </DropdownMenu.Item>
        ))}

        <div className="mx-2">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm text-text-secondary hover:bg-background hover:text-text-primary"
            onClick={() => setLangOpen((v) => !v)}
          >
            {t('nav.language')}
            {langOpen ? (
              <ChevronDown className="h-4 w-4" aria-hidden />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden />
            )}
          </button>
          {langOpen && <LanguageSubmenu onSelect={() => setOpen(false)} />}
        </div>
      </div>
    </DropdownMenu.Content>
  );

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t('nav.menu')}
          aria-expanded={isOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-text-primary transition hover:bg-background/80"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>{menuContent}</DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
