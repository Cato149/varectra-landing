import {
  contentLocales,
  defaultLocale,
  isLocaleId,
  resolveContentLocale,
  type ContentLocale,
  type LocaleId,
} from './locales';

export interface Localized {
  locale?: LocaleId;
}

const localeOf = (item: Localized): LocaleId => item.locale ?? defaultLocale;

/** Pick items for a UI locale, falling back to English when a pack is empty. */
export const pickLocalized = <T extends Localized>(
  items: T[],
  locale: LocaleId,
): T[] => {
  const pack = resolveContentLocale(locale);
  const matched = items.filter((item) => localeOf(item) === pack);
  if (matched.length > 0) return matched;
  return items.filter((item) => localeOf(item) === defaultLocale);
};

export const groupByContentLocale = <T extends Localized>(
  items: T[],
): Record<ContentLocale, T[]> => {
  const grouped = Object.fromEntries(
    contentLocales.map((id) => [id, items.filter((item) => localeOf(item) === id)]),
  ) as Record<ContentLocale, T[]>;

  const fallback = grouped[defaultLocale];
  for (const id of contentLocales) {
    if (grouped[id].length === 0) grouped[id] = fallback;
  }

  return grouped;
};

/** Read the locale folder from a collection id (`ru/01-visor` → `ru`). */
export const localeFromContentId = (id: string): LocaleId | undefined => {
  const slash = id.indexOf('/');
  if (slash < 0) return undefined;
  const prefix = id.slice(0, slash);
  return isLocaleId(prefix) ? prefix : undefined;
};

/** Folder wins over frontmatter so CMS i18n files do not need a locale field. */
export const resolveEntryLocale = (id: string, locale?: LocaleId): LocaleId =>
  localeFromContentId(id) ?? locale ?? defaultLocale;

/** Strip a locale folder prefix from a content collection id (`ru/01-visor` → `01-visor`). */
export const contentKey = (id: string): string => {
  const slash = id.indexOf('/');
  if (slash < 0) return id;
  const prefix = id.slice(0, slash);
  return isLocaleId(prefix) ? id.slice(slash + 1) : id;
};
