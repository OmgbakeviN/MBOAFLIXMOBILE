import React, { useState } from 'react';

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  KeyboardAvoidingView,
} from 'react-native-keyboard-controller';

import Feather from '@/components/FeatherCompat';
import {
  Href,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/AuthField';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      redirect?: string;
    }>();

  const { signIn } = useAuth();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] = useState(false);

  const [errors, setErrors] =
    useState<Errors>({});

  const [submitting, setSubmitting] =
    useState(false);

  const redirect =
    typeof params.redirect === 'string'
      ? params.redirect
      : '/';

  const validate = () => {
    const nextErrors: Errors = {};

    if (name.trim().length < 2) {
      nextErrors.name =
        'Enter your full name.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      nextErrors.email =
        'Enter a valid email address.';
    }

    if (password.length < 6) {
      nextErrors.password =
        'Use at least 6 characters.';
    }

    if (
      password !==
      confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (!acceptedTerms) {
      nextErrors.terms =
        'You must accept the terms.';
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  const handleRegister = async () => {
    if (!validate()) {
      Haptics.notificationAsync(
        Haptics
          .NotificationFeedbackType
          .Error
      );

      return;
    }

    setSubmitting(true);

    try {
      await signIn({
        name: name.trim(),
        email: email.trim(),
      });

      Haptics.notificationAsync(
        Haptics
          .NotificationFeedbackType
          .Success
      );

      router.replace(
        redirect as Href
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Unable to create account',
        'Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.navigation}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather
                name="arrow-left"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.brand}>
              MBOA
              <Text style={styles.brandGold}>
                {' '}FLIX
              </Text>
            </Text>
          </View>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Feather
                name="user-plus"
                size={25}
                color={THEME.gold}
              />
            </View>

            <Text style={styles.eyebrow}>
              JOIN MBOA FLIX
            </Text>

            <Text style={styles.title}>
              Create your account.
            </Text>

            <Text style={styles.subtitle}>
              Create your profile once, then return
              automatically to the movie you wanted
              to open.
            </Text>
          </View>

          <View style={styles.form}>
            <AuthField
              label="Full name"
              icon="user"
              value={name}
              onChangeText={(value) => {
                setName(value);

                setErrors(
                  (current) => ({
                    ...current,
                    name: undefined,
                  })
                );
              }}
              autoCapitalize="words"
              placeholder="Your full name"
              error={errors.name}
            />

            <AuthField
              label="Email"
              icon="mail"
              value={email}
              onChangeText={(value) => {
                setEmail(value);

                setErrors(
                  (current) => ({
                    ...current,
                    email: undefined,
                  })
                );
              }}
              keyboardType="email-address"
              placeholder="you@example.com"
              error={errors.email}
            />

            <AuthField
              label="Password"
              icon="lock"
              value={password}
              onChangeText={(value) => {
                setPassword(value);

                setErrors(
                  (current) => ({
                    ...current,
                    password: undefined,
                  })
                );
              }}
              secureTextEntry
              placeholder="Create a password"
              error={errors.password}
            />

            <AuthField
              label="Confirm password"
              icon="shield"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);

                setErrors(
                  (current) => ({
                    ...current,
                    confirmPassword: undefined,
                  })
                );
              }}
              secureTextEntry
              placeholder="Repeat your password"
              error={errors.confirmPassword}
            />

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();

                setAcceptedTerms(
                  (value) => !value
                );

                setErrors(
                  (current) => ({
                    ...current,
                    terms: undefined,
                  })
                );
              }}
              style={styles.termsRow}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms &&
                    styles.checkboxActive,
                ]}
              >
                {acceptedTerms && (
                  <Feather
                    name="check"
                    size={14}
                    color="#050505"
                  />
                )}
              </View>

              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.termsLink}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </Pressable>

            {!!errors.terms && (
              <Text style={styles.termsError}>
                {errors.terms}
              </Text>
            )}

            <Pressable
              disabled={submitting}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.pressed,
                submitting && {
                  opacity: 0.65,
                },
              ]}
            >
              <Text style={styles.registerButtonText}>
                {submitting
                  ? 'Creating account...'
                  : 'Create Account'}
              </Text>

              <Feather
                name="arrow-right"
                size={18}
                color="#050505"
              />
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginQuestion}>
                Already have an account?
              </Text>

              <Pressable
                onPress={() =>
                  router.replace({
                    pathname: '/login',
                    params: {
                      redirect,
                    },
                  })
                }
              >
                <Text style={styles.loginLink}>
                  Sign in
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: '#050505',
  },

  scroll: {
    paddingBottom: 45,
  },

  navigation: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  brandGold: {
    color: THEME.gold,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 30,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.18)',
    marginBottom: 20,
  },

  eyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 6,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.43)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 330,
  },

  form: {
    paddingHorizontal: 18,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
    marginBottom: 8,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  checkboxActive: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },

  termsText: {
    flex: 1,
    color: 'rgba(255,255,255,0.43)',
    fontSize: 11,
    lineHeight: 17,
  },

  termsLink: {
    color: THEME.gold,
  },

  termsError: {
    color: '#E85A5A',
    fontSize: 11,
    marginBottom: 12,
    marginLeft: 32,
  },

  registerButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: THEME.gold,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  registerButtonText: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '800',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 23,
  },

  loginQuestion: {
    color: 'rgba(255,255,255,0.40)',
    fontSize: 12,
  },

  loginLink: {
    color: THEME.gold,
    fontSize: 12,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
