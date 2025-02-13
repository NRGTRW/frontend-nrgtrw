// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
// (Later, add more languages as needed)
import translationEN from './locales/en/translation.json';
import translationBG from './locales/bg/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  bg: {
    translation: translationBG,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles XSS protection
  },
});

export default i18n;
