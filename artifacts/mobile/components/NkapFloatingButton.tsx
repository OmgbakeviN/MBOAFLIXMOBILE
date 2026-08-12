import React from 'react';

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import { THEME } from '@/constants/theme';

export function NkapFloatingButton() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('ai.open', { defaultValue: 'Open Nkap AI' })}
      onPress={() => {
        Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Light
        );
        router.push('/ai');
      }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <BlurView
        intensity={80}
        tint="dark"
        experimentalBlurMethod={
          Platform.OS === 'android'
            ? 'dimezisBlurView'
            : undefined
        }
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.tint} />
      <Text style={styles.spark}>✦</Text>
      <View style={styles.onlineDot} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.45)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,15,7,0.68)',
  },
  spark: {
    color: THEME.goldLight,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    right: 9,
    bottom: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#45D483',
    borderWidth: 1.5,
    borderColor: '#16110A',
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
});
