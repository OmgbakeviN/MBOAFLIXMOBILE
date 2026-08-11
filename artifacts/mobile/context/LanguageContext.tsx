import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

import i18n from '@/i18n';

export type LanguagePreference =
  | 'system'
  | 'fr'
  | 'en';

interface LanguageContextValue {
  language: LanguagePreference;
  currentLanguage: 'fr' | 'en';
  isReady: boolean;
  changeLanguage: (
    language: LanguagePreference
  ) => Promise<void>;
}

const STORAGE_KEY =
  '@mboa_flix_language';

const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(undefined);

function getSystemLanguage():
  | 'fr'
  | 'en' {
  return getLocales()[0]
    ?.languageCode === 'fr'
    ? 'fr'
    : 'en';
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    language,
    setLanguage,
  ] =
    useState<LanguagePreference>(
      'system'
    );

  const [
    currentLanguage,
    setCurrentLanguage,
  ] =
    useState<'fr' | 'en'>(
      getSystemLanguage()
    );

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const restore =
      async () => {
        try {
          const stored =
            await AsyncStorage.getItem(
              STORAGE_KEY
            );

          const preference:
            LanguagePreference =
            stored === 'fr' ||
            stored === 'en' ||
            stored === 'system'
              ? stored
              : 'system';

          const resolved =
            preference === 'system'
              ? getSystemLanguage()
              : preference;

          setLanguage(preference);
          setCurrentLanguage(
            resolved
          );

          await i18n.changeLanguage(
            resolved
          );
        } catch (error) {
          console.warn(
            'Unable to restore language preference.',
            error
          );
        } finally {
          setIsReady(true);
        }
      };

    restore();
  }, []);

  const changeLanguage =
    async (
      preference:
        LanguagePreference
    ) => {
      const resolved =
        preference === 'system'
          ? getSystemLanguage()
          : preference;

      setLanguage(preference);
      setCurrentLanguage(
        resolved
      );

      await i18n.changeLanguage(
        resolved
      );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        preference
      );
    };

  const value = useMemo(
    () => ({
      language,
      currentLanguage,
      isReady,
      changeLanguage,
    }),
    [
      language,
      currentLanguage,
      isReady,
    ]
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider.'
    );
  }

  return context;
}
