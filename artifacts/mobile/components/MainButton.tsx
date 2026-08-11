import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Feather from '@/components/FeatherCompat';
import * as Haptics from 'expo-haptics';
import { THEME } from '@/constants/theme';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface MainButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: FeatherIconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function MainButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
}: MainButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#0A0A0A' : THEME.gold}
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Feather
              name={icon}
              size={16}
              color={variant === 'primary' ? '#0A0A0A' : '#FFFFFF'}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.label,
              variant === 'primary' && styles.primaryLabel,
              variant === 'secondary' && styles.secondaryLabel,
              variant === 'outline' && styles.outlineLabel,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primary: {
    backgroundColor: THEME.gold,
  },
  secondary: {
    backgroundColor: THEME.cardElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.gold,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {},
  label: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryLabel: {
    color: '#0A0A0A',
  },
  secondaryLabel: {
    color: '#FFFFFF',
  },
  outlineLabel: {
    color: THEME.gold,
  },
});
