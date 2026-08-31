import { derived, get, writable } from 'svelte/store';
import {
  defaultLocale,
  htmlLang,
  LOCALE_STORAGE_KEY,
  persistLocale,
  resolveInitialLocale,
  type LocaleId,
} from './locales';
import { getMessages } from './messages';

export const locale = writable<LocaleId>(defaultLocale);

export const messages = derived(locale, getMessages);

const applyDocumentLocale = (next: LocaleId): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = htmlLang(next);
  document.documentElement.dataset.locale = next;
};

export const setLocale = (next: LocaleId): void => {
  locale.set(next);
  applyDocumentLocale(next);
  if (typeof localStorage === 'undefined') return;
  persistLocale(next, localStorage);
};

export const initLocale = (): LocaleId => {
  const stored = typeof localStorage === 'undefined'
    ? null
    : localStorage.getItem(LOCALE_STORAGE_KEY);
  const languages = typeof navigator === 'undefined' ? [] : [...navigator.languages];
  const next = resolveInitialLocale(stored, languages);
  locale.set(next);
  applyDocumentLocale(next);
  return next;
};

export const currentLocale = (): LocaleId => get(locale);
