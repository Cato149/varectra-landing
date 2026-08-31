export const localeIds = ['en', 'ru', 'by'] as const;

export type LocaleId = (typeof localeIds)[number];

/** Short labels drawn in the locale switcher. */
export const localeLabels: Record<LocaleId, string> = {
  en: 'ENG',
  ru: 'RU',
  by: 'BY',
};

/** Locales that ship a content pack under src/content/{collection}/{locale}/. */
export const contentLocales = ['en', 'ru', 'by'] as const satisfies readonly LocaleId[];

export type ContentLocale = (typeof contentLocales)[number];

export const defaultLocale: ContentLocale = 'en';

export const LOCALE_STORAGE_KEY = 'varectra-locale';

export const isLocaleId = (value: string): value is LocaleId =>
  (localeIds as readonly string[]).includes(value);

export const isContentLocale = (value: string): value is ContentLocale =>
  (contentLocales as readonly string[]).includes(value);

export const parseLocale = (value: string | null | undefined): LocaleId | undefined => {
  const key = value?.trim().toLowerCase().replace(/_/g, '-');
  if (!key) return undefined;

  switch (key) {
    case 'english':
      return 'en';
    case 'russian':
      return 'ru';
    default:
      break;
  }

  const primary = key.split('-')[0] ?? key;
  switch (primary) {
    case 'en':
    case 'eng':
      return 'en';
    case 'ru':
    case 'rus':
      return 'ru';
    case 'be':
    case 'bel':
    case 'by':
      return 'by';
    default:
      return isLocaleId(key) ? key : undefined;
  }
};

/** First matching tag from `navigator.languages`; unknown languages fall back to English. */
export const detectBrowserLocale = (languages: readonly string[]): LocaleId => {
  for (const language of languages) {
    const parsed = parseLocale(language);
    if (parsed) return parsed;
  }
  return defaultLocale;
};

/**
 * Explicit user choice in storage wins. Otherwise use the browser locale.
 */
export const resolveInitialLocale = (
  stored: string | null | undefined,
  languages: readonly string[],
): LocaleId => parseLocale(stored) ?? detectBrowserLocale(languages);

/** Content pack for a selected UI locale. Unknown ids fall back to English. */
export const resolveContentLocale = (locale: LocaleId): ContentLocale =>
  isContentLocale(locale) ? locale : defaultLocale;

export const htmlLang = (locale: LocaleId): string => {
  switch (locale) {
    case 'en':
      return 'en';
    case 'ru':
      return 'ru';
    case 'by':
      return 'be';
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
};

export const persistLocale = (locale: LocaleId, storage: Storage): void => {
  storage.setItem(LOCALE_STORAGE_KEY, locale);
};

export const readStoredLocale = (storage: Storage): LocaleId | undefined =>
  parseLocale(storage.getItem(LOCALE_STORAGE_KEY));
