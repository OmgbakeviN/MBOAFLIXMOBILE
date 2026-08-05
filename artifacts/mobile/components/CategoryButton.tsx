import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '@/constants/theme';

interface CategoryButtonProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryButton({ label, active = false, onPress }: CategoryButtonProps) {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        active ? styles.activeButton : styles.inactiveButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderColor: THEME.cardBorder,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  activeLabel: {
    color: '#0A0A0A',
  },
  inactiveLabel: {
    color: THEME.textSecondary,
  },
});
