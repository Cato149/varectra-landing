import { describe, expect, it } from 'vitest';
import {
  contentKey,
  groupByContentLocale,
  localeFromContentId,
  pickLocalized,
  resolveEntryLocale,
} from '../src/lib/i18n/content';
import {
  detectBrowserLocale,
  htmlLang,
  parseLocale,
  persistLocale,
  readStoredLocale,
  resolveContentLocale,
  resolveInitialLocale,
} from '../src/lib/i18n/locales';
import { getMessages } from '../src/lib/i18n/messages';

describe('locales', () => {
  it('parses locale aliases', () => {
    expect(parseLocale('ENG')).toBe('en');
    expect(parseLocale('en-GB')).toBe('en');
    expect(parseLocale('ru')).toBe('ru');
    expect(parseLocale('ru-RU')).toBe('ru');
    expect(parseLocale('be')).toBe('by');
    expect(parseLocale('be-BY')).toBe('by');
    expect(parseLocale('nope')).toBeUndefined();
  });

  it('treats Belarusian as its own content pack', () => {
    expect(resolveContentLocale('by')).toBe('by');
    expect(resolveContentLocale('ru')).toBe('ru');
    expect(htmlLang('by')).toBe('be');
  });

  it('persists and restores the selected locale', () => {
    const storage = new Map<string, string>();
    const fake = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    };
    persistLocale('ru', fake);
    expect(readStoredLocale(fake)).toBe('ru');
    expect(readStoredLocale({ getItem: () => null })).toBeUndefined();
  });

  it('defaults to the browser locale until the user picks one', () => {
    expect(detectBrowserLocale(['de-DE', 'ru-RU'])).toBe('ru');
    expect(detectBrowserLocale(['be-BY'])).toBe('by');
    expect(detectBrowserLocale(['de-DE', 'fr-FR'])).toBe('en');
    expect(resolveInitialLocale(null, ['ru-RU', 'en-US'])).toBe('ru');
    expect(resolveInitialLocale('en', ['ru-RU'])).toBe('en');
  });

  it('serves Russian UI copy and English fallback for BY', () => {
    expect(getMessages('ru').nav.contacts).toBe('Контакты');
    expect(getMessages('by').nav.contacts).toBe('Contacts');
  });

  it('keeps the whoami window title on every UI locale', () => {
    expect(getMessages('en').whoami.window).toBe('WHOAMI');
    expect(getMessages('ru').whoami.window).toBe('WHOAMI');
    expect(getMessages('by').whoami.window).toBe('WHOAMI');
  });
});

describe('localized content grouping', () => {
  it('picks a locale pack and falls back to English', () => {
    const items = [
      { locale: 'en' as const, title: 'Hello' },
      { locale: 'ru' as const, title: 'Привет' },
    ];
    expect(pickLocalized(items, 'ru')).toEqual([{ locale: 'ru', title: 'Привет' }]);
    expect(pickLocalized(items, 'by')).toEqual([{ locale: 'en', title: 'Hello' }]);
    expect(pickLocalized([...items, { locale: 'by' as const, title: 'Прывітанне' }], 'by')).toEqual([
      { locale: 'by', title: 'Прывітанне' },
    ]);
  });

  it('groups content so a missing pack reuses English', () => {
    const grouped = groupByContentLocale([
      { locale: 'en' as const, title: 'Hello' },
    ]);
    expect(grouped.ru).toEqual([{ locale: 'en', title: 'Hello' }]);
  });

  it('strips locale folders from content ids', () => {
    expect(contentKey('ru/01-visor')).toBe('01-visor');
    expect(contentKey('en/01-visor')).toBe('01-visor');
    expect(contentKey('by/01-visor')).toBe('01-visor');
    expect(contentKey('01-visor')).toBe('01-visor');
  });

  it('reads locale from the folder before frontmatter', () => {
    expect(localeFromContentId('ru/01-bio')).toBe('ru');
    expect(localeFromContentId('by/01-bio')).toBe('by');
    expect(localeFromContentId('01-bio')).toBeUndefined();
    expect(resolveEntryLocale('by/01-bio', 'en')).toBe('by');
    expect(resolveEntryLocale('01-bio', 'ru')).toBe('ru');
  });
});
