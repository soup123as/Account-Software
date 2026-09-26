import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '@/locales/en/common.json';

export const defaultNS = 'common';

export const resources = {
  en: { common: enCommon },
} as const;

/** Languages written right-to-left; used to set <html dir>. */
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

export function directionFor(language: string): 'ltr' | 'rtl' {
  return RTL_LANGUAGES.has(language.split('-')[0] ?? '') ? 'rtl' : 'ltr';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS,
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = directionFor(language);
});

export default i18n;
