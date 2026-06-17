export type SupportedLocale = 'en' | 'zh-CN' | 'zh-TW' | 'my' | 'id' | 'vi' | 'th' | 'ms';

export interface LocaleDefinition {
  code: SupportedLocale;
  shortLabel: string;
  nativeLabel: string;
  englishLabel: string;
}

export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'zh-CN', shortLabel: '简', nativeLabel: '简体中文', englishLabel: 'Simplified Chinese' },
  { code: 'zh-TW', shortLabel: '繁', nativeLabel: '繁體中文', englishLabel: 'Traditional Chinese' },
  { code: 'my', shortLabel: 'MY', nativeLabel: 'မြန်မာ', englishLabel: 'Burmese' },
  { code: 'id', shortLabel: 'ID', nativeLabel: 'Bahasa Indonesia', englishLabel: 'Indonesian' },
  { code: 'vi', shortLabel: 'VI', nativeLabel: 'Tiếng Việt', englishLabel: 'Vietnamese' },
  { code: 'th', shortLabel: 'TH', nativeLabel: 'ไทย', englishLabel: 'Thai' },
  { code: 'ms', shortLabel: 'MS', nativeLabel: 'Bahasa Melayu', englishLabel: 'Malay' },
];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

const LOCALE_CODES = new Set<SupportedLocale>(SUPPORTED_LOCALES.map((l) => l.code));

export function isSupportedLocale(value: string): value is SupportedLocale {
  return LOCALE_CODES.has(value as SupportedLocale);
}

export function getLocaleDefinition(code: SupportedLocale): LocaleDefinition {
  return SUPPORTED_LOCALES.find((l) => l.code === code) ?? SUPPORTED_LOCALES[0];
}

const BROWSER_LOCALE_PATTERNS: { prefix: string; locale: SupportedLocale }[] = [
  { prefix: 'zh-cn', locale: 'zh-CN' },
  { prefix: 'zh-tw', locale: 'zh-TW' },
  { prefix: 'zh-hk', locale: 'zh-TW' },
  { prefix: 'zh', locale: 'zh-CN' },
  { prefix: 'my', locale: 'my' },
  { prefix: 'id', locale: 'id' },
  { prefix: 'vi', locale: 'vi' },
  { prefix: 'th', locale: 'th' },
  { prefix: 'ms', locale: 'ms' },
];

export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const raw = navigator.language.toLowerCase();
  for (const { prefix, locale } of BROWSER_LOCALE_PATTERNS) {
    if (raw === prefix || raw.startsWith(`${prefix}-`)) return locale;
  }
  return DEFAULT_LOCALE;
}
