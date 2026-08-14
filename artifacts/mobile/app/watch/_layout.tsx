import React from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Redirect,
  Slot,
  usePathname,
} from 'expo-router';
import { useTranslation } from 'react-i18next';

import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function WatchLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const {
    isAuthenticated,
    isReady,
  } = useAuth();

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="small"
          color={THEME.gold}
        />
        <Text style={styles.loadingText}>
          {t('system.preparing')}
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Redirect
        href={{
          pathname: '/login',
          params: {
            redirect: pathname || '/',
          },
        }}
      />
    );
  }

  // Important: use Slot here, not a nested Stack.
  // The root navigator already owns the `watch` route. A second Stack
  // could pop its only child and leave an empty black screen on Android.
  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: THEME.background,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
});
