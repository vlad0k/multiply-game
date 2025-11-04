import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRU from './locales/ru.json';
import translationEN from './locales/en.json';
import translationNO from './locales/no.json';
import translationUK from './locales/uk.json';

const resources = {
  ru: {
    translation: translationRU
  },
  en: {
    translation: translationEN
  },
  no: {
    translation: translationNO
  },
  uk: {
    translation: translationUK
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'en', 'no', 'uk'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

