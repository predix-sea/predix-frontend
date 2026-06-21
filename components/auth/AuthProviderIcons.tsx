import { cn } from '@/lib/cn';
import { METAMASK_FOX_PATHS, METAMASK_FOX_TRANSFORM } from './metamaskFoxPaths';

export type WalletProviderId =
  | 'telegram'
  | 'steam'
  | 'metamask'
  | 'okx'
  | 'coinbase'
  | 'rabby'
  | 'phantom'
  | 'more';

export const WALLET_PROVIDER_ORDER: WalletProviderId[] = [
  'telegram',
  'steam',
  'metamask',
  'okx',
  'coinbase',
  'rabby',
  'phantom',
  'more',
];

export const WALLET_PROVIDER_LABELS: Record<WalletProviderId, string> = {
  telegram: 'Telegram',
  steam: 'Steam',
  metamask: 'MetaMask',
  okx: 'OKX Wallet',
  coinbase: 'Coinbase Wallet',
  rabby: 'Rabby Wallet',
  phantom: 'Phantom',
  more: 'More wallets',
};

interface AuthProviderIconProps {
  id: WalletProviderId;
  className?: string;
}

export function AuthProviderIcon({ id, className }: AuthProviderIconProps) {
  const iconClass = cn('h-8 w-8', className);

  switch (id) {
    case 'telegram':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#229ED9" />
          <path
            fill="#fff"
            d="M7.2 15.4c5.5-2.4 9.2-4 11-4.7 4.7-2 5.7-2.3 6.3-2.3.1 0 .3 0 .4.1.1.1.1.2.1.3 0 .1-.1.4-.2.6-.7 3.1-3.7 12.7-3.9 13-.1 0-.2.1-.3.1s-.3 0-.4-.2c-.1-.1-1.6-1-4.5-2.9-.8-.5-1.4-.9-1.5-.9-.1 0-.3.1-.4.3l-.6 1.8c-.2.7-.6 1.4-1 1.4-.3 0-.7-.2-1.1-.5-1.2-.8-2.1-1.4-3.4-2.3-1.5-1-2.6-1.7-2.6-2.7 0-.4.3-.9.9-1.4.7-.6 5.6-5.2 5.7-5.6.1-.1.1-.2 0-.3 0-.1-.1-.1-.2-.1-.1 0-.3 0-.5.1z"
          />
        </svg>
      );
    case 'steam':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#171A21" />
          <path
            fill="#fff"
            d="M8.2 20.1c-.5-.8-.8-1.7-.8-2.7 0-2.8 2.3-5.1 5.1-5.1 1.1 0 2.1.4 2.9 1l-1.2 1.7c-.5-.4-1.2-.6-1.8-.6-1.8 0-3.3 1.5-3.3 3.3 0 .6.2 1.2.5 1.7l-1.4 1.1zm7.8-4.6c0 2.2-1.8 4-4 4-.7 0-1.4-.2-2-.5l3.1-4.5c.4.6.9 1 1.6 1 .7 0 1.3-.6 1.3-1.3 0-.3-.1-.7-.3-1l1.8-1.2c.4.7.5 1.5.5 2.3zm4.2 1.2c0 2.2-1.8 4-4 4-1 0-1.9-.4-2.6-1l1.2-1.7c.4.3 1 .5 1.5.5 1.1 0 1.9-.9 1.9-1.9 0-.4-.1-.7-.2-1l1.8-1.2c.3.7.4 1.5.4 2.3z"
          />
          <circle cx="20.5" cy="15.5" r="2" fill="#fff" />
        </svg>
      );
    case 'metamask':
      return (
        <svg
          viewBox="0 0 142 137"
          overflow="visible"
          preserveAspectRatio="xMidYMid meet"
          className={iconClass}
          aria-hidden
        >
          <g transform={METAMASK_FOX_TRANSFORM}>
            {METAMASK_FOX_PATHS.map(({ d, fill }, index) => (
              <path key={index} fill={fill} d={d} />
            ))}
          </g>
        </svg>
      );
    case 'okx':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <rect width="32" height="32" rx="8" fill="#000" />
          <rect x="5" y="5" width="7.5" height="7.5" rx="1.5" fill="#fff" />
          <rect x="19.5" y="5" width="7.5" height="7.5" rx="1.5" fill="#fff" />
          <rect x="5" y="19.5" width="7.5" height="7.5" rx="1.5" fill="#fff" />
          <rect x="19.5" y="19.5" width="7.5" height="7.5" rx="1.5" fill="#fff" />
        </svg>
      );
    case 'coinbase':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#0052FF" />
          <rect x="10" y="10" width="12" height="12" rx="2.5" fill="#fff" />
        </svg>
      );
    case 'rabby':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <rect width="32" height="32" rx="8" fill="#8697FF" />
          <path
            fill="#fff"
            d="M10 12.5c0-1.4 1.1-2.5 2.5-2.5h7c1.4 0 2.5 1.1 2.5 2.5v1.2c0 .6-.5 1.1-1.1 1.1h-1.1v5.2c0 1.4-1.1 2.5-2.5 2.5h-3.8c-1.4 0-2.5-1.1-2.5-2.5v-5.2H11.1c-.6 0-1.1-.5-1.1-1.1V12.5zm3.4 2.3v4.4h5.2v-4.4h-5.2zm1.8 1.1h1.6v2.2h-1.6v-2.2z"
          />
          <circle cx="13.2" cy="14.2" r="0.9" fill="#8697FF" />
          <circle cx="18.8" cy="14.2" r="0.9" fill="#8697FF" />
        </svg>
      );
    case 'phantom':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <circle cx="16" cy="16" r="16" fill="#AB9FF2" />
          <path
            fill="#fff"
            d="M12 11h8c2.8 0 5 2.2 5 5v1.2c0 1.2-1 2.2-2.2 2.2h-1.1v3.4h-2.4v-3.4h-2.4v3.4h-2.4v-3.4H13c-1.2 0-2.2-1-2.2-2.2V16c0-2.8 2.2-5 5-5zm0 2.4c-1.4 0-2.6 1.2-2.6 2.6v.6h13.2v-.6c0-1.4-1.2-2.6-2.6-2.6H12z"
          />
        </svg>
      );
    case 'more':
      return (
        <svg viewBox="0 0 32 32" className={iconClass} aria-hidden>
          <circle cx="10" cy="16" r="2" fill="#9CA3AF" />
          <circle cx="16" cy="16" r="2" fill="#9CA3AF" />
          <circle cx="22" cy="16" r="2" fill="#9CA3AF" />
        </svg>
      );
  }
}
