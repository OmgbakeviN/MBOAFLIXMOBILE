import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import * as Haptics from 'expo-haptics';

import { THEME } from '@/constants/theme';

interface CategoryButtonProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryButton({
  label,
  active = false,
  onPress,
}: CategoryButtonProps) {
  const handlePress = () => {
    Haptics.selectionAsync();

    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,

        active
          ? styles.active
          : styles.inactive,

        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,

          active
            ? styles.activeText
            : styles.inactiveText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,

    justifyContent: 'center',

    paddingHorizontal: 18,

    borderRadius: 21,

    marginRight: 9,

    borderWidth: 1,
  },

  active: {
    backgroundColor: THEME.gold,

    borderColor: THEME.gold,
  },

  inactive: {
    backgroundColor:
      'rgba(255,255,255,0.035)',

    borderColor:
      'rgba(255,255,255,0.10)',
  },

  pressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  text: {
    fontSize: 13,
    fontWeight: '600',
  },

  activeText: {
    color: '#080808',
  },

  inactiveText: {
    color:
      'rgba(255,255,255,0.66)',
  },
});