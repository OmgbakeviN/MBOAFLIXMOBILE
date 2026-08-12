import React from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Redirect,
  Stack,
  usePathname,
} from 'expo-router';

import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function MovieLayout() {
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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: THEME.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
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
