import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoredSettings {
  autoplayVideos: boolean;
  preferCaptions: boolean;
}

interface SettingsContextValue
  extends StoredSettings {
  isReady: boolean;
  setAutoplayVideos: (
    value: boolean
  ) => Promise<void>;
  setPreferCaptions: (
    value: boolean
  ) => Promise<void>;
  resetPlaybackSettings: () => Promise<void>;
}

const STORAGE_KEY =
  '@mboa_flix_settings';

const DEFAULT_SETTINGS: StoredSettings = {
  autoplayVideos: false,
  preferCaptions: false,
};

const SettingsContext =
  createContext<
    SettingsContextValue | undefined
  >(undefined);

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<StoredSettings>(
      DEFAULT_SETTINGS
    );

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        if (stored) {
          const parsed = JSON.parse(
            stored
          ) as Partial<StoredSettings>;

          setSettings({
            autoplayVideos:
              typeof parsed.autoplayVideos ===
              'boolean'
                ? parsed.autoplayVideos
                : DEFAULT_SETTINGS.autoplayVideos,
            preferCaptions:
              typeof parsed.preferCaptions ===
              'boolean'
                ? parsed.preferCaptions
                : DEFAULT_SETTINGS.preferCaptions,
          });
        }
      } catch (error) {
        console.warn(
          'Unable to restore MBOA FLIX settings.',
          error
        );
      } finally {
        setIsReady(true);
      }
    };

    restore();
  }, []);

  const persist = async (
    next: StoredSettings
  ) => {
    setSettings(next);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch (error) {
      console.warn(
        'Unable to persist MBOA FLIX settings.',
        error
      );
    }
  };

  const setAutoplayVideos = async (
    value: boolean
  ) => {
    await persist({
      ...settings,
      autoplayVideos: value,
    });
  };

  const setPreferCaptions = async (
    value: boolean
  ) => {
    await persist({
      ...settings,
      preferCaptions: value,
    });
  };

  const resetPlaybackSettings =
    async () => {
      await persist(
        DEFAULT_SETTINGS
      );
    };

  const value = useMemo(
    () => ({
      ...settings,
      isReady,
      setAutoplayVideos,
      setPreferCaptions,
      resetPlaybackSettings,
    }),
    [settings, isReady]
  );

  return (
    <SettingsContext.Provider
      value={value}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (!context) {
    throw new Error(
      'useSettings must be used inside SettingsProvider.'
    );
  }

  return context;
}
