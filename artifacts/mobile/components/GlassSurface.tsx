import React, { ReactNode } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { BlurView } from 'expo-blur';
import {
  GlassView,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';

import { THEME } from '@/constants/theme';

interface GlassSurfaceProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  strong?: boolean;
  interactive?: boolean;
}

export function GlassSurface({
  children,
  style,
  intensity = 70,
  strong = false,
  interactive = false,
}: GlassSurfaceProps) {
  const canUseAppleGlass =
    Platform.OS === 'ios' && isLiquidGlassAvailable();

  if (canUseAppleGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        tintColor="rgba(10,10,10,0.35)"
        isInteractive={interactive}
        style={[styles.base, style]}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod={
          Platform.OS === 'android'
            ? 'dimezisBlurView'
            : undefined
        }
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: strong
              ? THEME.glassStrong
              : THEME.glass,
          },
        ]}
      />

      <View
        pointerEvents="none"
        style={styles.highlight}
      />

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },

  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    backgroundColor: THEME.glass,
  },

  highlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: THEME.glassHighlight,
  },

  content: {
    flex: 1,
  },
});