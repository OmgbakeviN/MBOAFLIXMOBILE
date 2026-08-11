import React, { useState } from 'react';

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import Feather from '@/components/FeatherCompat';
import { BlurView } from 'expo-blur';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface AuthFieldProps {
  label: string;
  icon: FeatherIconName;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  error?: string;
}

export function AuthField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}: AuthFieldProps) {
  const [passwordVisible, setPasswordVisible] =
    useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          Boolean(error) && styles.inputError,
        ]}
      >
        <BlurView
          intensity={45}
          tint="dark"
          experimentalBlurMethod={
            Platform.OS === 'android'
              ? 'dimezisBlurView'
              : undefined
          }
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.tint} />

        <Feather
          name={icon}
          size={18}
          color={
            error
              ? '#E85A5A'
              : 'rgba(255,255,255,0.45)'
          }
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.28)"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={
            secureTextEntry && !passwordVisible
          }
          style={styles.input}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() =>
              setPasswordVisible(
                (current) => !current
              )
            }
            hitSlop={10}
          >
            <Feather
              name={
                passwordVisible
                  ? 'eye-off'
                  : 'eye'
              }
              size={18}
              color="rgba(255,255,255,0.45)"
            />
          </Pressable>
        )}
      </View>

      {!!error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 17,
  },

  label: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },

  inputWrapper: {
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,20,20,0.62)',
  },

  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: '100%',
  },

  inputError: {
    borderColor: 'rgba(232,90,90,0.60)',
  },

  error: {
    color: '#E85A5A',
    fontSize: 11,
    marginTop: 6,
  },
});
