import en from '@/messages/en.json';
import zhCN from '@/messages/zh-CN.json';
import zhTW from '@/messages/zh-TW.json';
import my from '@/messages/my.json';
import id from '@/messages/id.json';
import vi from '@/messages/vi.json';
import th from '@/messages/th.json';
import ms from '@/messages/ms.json';
import { DEFAULT_LOCALE, type SupportedLocale } from './locales';

export type Messages = typeof en;

const MESSAGE_CATALOG: Record<SupportedLocale, Record<string, unknown>> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  my,
  id,
  vi,
  th,
  ms,
};

function resolveKey(messages: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (current === null || typeof current !== 'object' || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export function getMessages(locale: SupportedLocale): Messages {
  return (MESSAGE_CATALOG[locale] ?? MESSAGE_CATALOG[DEFAULT_LOCALE]) as Messages;
}

function applyVars(message: string, vars?: Record<string, string | number>): string {
  if (!vars) return message;
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    message,
  );
}

export function t(
  key: string,
  locale: SupportedLocale,
  vars?: Record<string, string | number>,
): string {
  const localized = resolveKey(getMessages(locale) as Record<string, unknown>, key);
  if (localized !== undefined) return applyVars(localized, vars);

  const fallback = resolveKey(MESSAGE_CATALOG[DEFAULT_LOCALE], key);
  return applyVars(fallback ?? key, vars);
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, detectBrowserLocale, isSupportedLocale } from './locales';
export type { LocaleDefinition, SupportedLocale } from './locales';
