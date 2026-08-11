import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';
import { NkapFloatingButton } from '@/components/NkapFloatingButton';
import { THEME } from '@/constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: THEME.goldLight,
          tabBarInactiveTintColor:
            'rgba(255,255,255,0.45)',

          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom:
              Platform.OS === 'web'
                ? 14
                : Math.max(insets.bottom, 10),
            height: 70,
            borderRadius: 28,
            overflow: 'hidden',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor:
              'rgba(255,255,255,0.12)',
            elevation: 0,
            shadowColor: '#000',
            shadowOpacity: 0.35,
            shadowRadius: 20,
            shadowOffset: {
              width: 0,
              height: 10,
            },
            paddingTop: 7,
            paddingBottom: 7,
          },

          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFill}>
              <BlurView
                intensity={75}
                tint="dark"
                experimentalBlurMethod={
                  Platform.OS === 'android'
                    ? 'dimezisBlurView'
                    : undefined
                }
                style={StyleSheet.absoluteFill}
              />

              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.glassOverlay,
                ]}
              />

              <View style={styles.highlight} />
            </View>
          ),

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },

          tabBarItemStyle: {
            borderRadius: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('common.home'),
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="home"
                size={size ?? 21}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: t('common.explore'),
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="search"
                size={size ?? 21}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="culture"
          options={{
            title: t('common.culture'),
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="globe"
                size={size ?? 21}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: t('common.profile'),
            tabBarIcon: ({ color, size }) => (
              <Feather
                name="user"
                size={size ?? 21}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <NkapFloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.background,
  },

  glassOverlay: {
    backgroundColor: 'rgba(12,12,12,0.58)',
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
