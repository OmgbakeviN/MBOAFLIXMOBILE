import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import { en } from './locales/en';
import { fr } from './locales/fr';

const languageCode =
  getLocales()[0]?.languageCode;

const initialLanguage =
  languageCode === 'fr'
    ? 'fr'
    : 'en';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: en,
        },
        fr: {
          translation: fr,
        },
      },

      lng: initialLanguage,
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
