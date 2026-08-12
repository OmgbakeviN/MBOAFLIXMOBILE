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
import { LinearGradient } from 'expo-linear-gradient';
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
import { useTranslation } from 'react-i18next';

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      redirect?: string;
    }>();

  const { signIn } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

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

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      nextErrors.email =
        t('auth.errors.emailRequired');
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      nextErrors.email =
        t('auth.errors.invalidEmail');
    }

    if (!password) {
      nextErrors.password =
        t('auth.errors.passwordRequired');
    } else if (
      password.length < 6
    ) {
      nextErrors.password =
        t('auth.errors.passwordLength');
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  const handleLogin = async () => {
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
      const cleanEmail =
        email.trim();

      const defaultName =
        cleanEmail
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(
            /\b\w/g,
            (character) =>
              character.toUpperCase()
          ) || 'MBOA User';

      await signIn({
        name: defaultName,
        email: cleanEmail,
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
        t('system.unableSignIn'),
        t('system.pleaseTryAgain')
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
          <View style={styles.topNavigation}>
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

          <View style={styles.hero}>
            <LinearGradient
              colors={[
                '#281604',
                '#110D08',
                '#050505',
              ]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroGlow} />

            <View style={styles.heroIcon}>
              <Feather
                name="play"
                size={28}
                color="#050505"
              />
            </View>

            <Text style={styles.heroEyebrow}>
              {t('auth.welcomeBack')}
            </Text>

            <Text style={styles.heroTitle}>
              {t('auth.continueJourney')}
            </Text>

            <Text style={styles.heroText}>
              {t('auth.loginDescription')}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.demoBanner}>
              <Feather
                name="shield"
                size={15}
                color={THEME.gold}
              />

              <Text style={styles.demoText}>
                {t('auth.prototypeNotice')}
              </Text>
            </View>

            <AuthField
              label={t('auth.email')}
              icon="mail"
              value={email}
              onChangeText={(value) => {
                setEmail(value);

                if (errors.email) {
                  setErrors(
                    (current) => ({
                      ...current,
                      email: undefined,
                    })
                  );
                }
              }}
              placeholder={t('auth.emailPlaceholder')}
              keyboardType="email-address"
              error={errors.email}
            />

            <AuthField
              label={t('auth.password')}
              icon="lock"
              value={password}
              onChangeText={(value) => {
                setPassword(value);

                if (errors.password) {
                  setErrors(
                    (current) => ({
                      ...current,
                      password: undefined,
                    })
                  );
                }
              }}
              placeholder={t('auth.passwordPlaceholder')}
              secureTextEntry
              error={errors.password}
            />

            <Pressable style={styles.forgotButton}>
              <Text style={styles.forgotText}>
                {t('auth.forgotPassword')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogin}
              disabled={submitting}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.pressed,
                submitting && {
                  opacity: 0.65,
                },
              ]}
            >
              <Text style={styles.loginText}>
                {submitting
                  ? t('auth.signingIn')
                  : t('auth.signIn')}
              </Text>

              <Feather
                name="arrow-right"
                size={18}
                color="#050505"
              />
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.registerQuestion}>
                {t('auth.newToMboa')}
              </Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/register',
                    params: {
                      redirect,
                    },
                  })
                }
              >
                <Text style={styles.registerLink}>
                  {t('auth.createAccount')}
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
    paddingBottom: 40,
  },

  topNavigation: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  brandGold: {
    color: THEME.gold,
  },

  hero: {
    minHeight: 300,
    marginHorizontal: 18,
    borderRadius: 30,
    overflow: 'hidden',
    padding: 23,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.14)',
  },

  heroGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    right: -80,
    top: -80,
    backgroundColor: 'rgba(216,178,92,0.12)',
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.gold,
    marginBottom: 22,
  },

  heroEyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 5,
  },

  heroText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 315,
  },

  form: {
    paddingHorizontal: 18,
    paddingTop: 30,
  },

  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 13,
    borderRadius: 16,
    backgroundColor: 'rgba(216,178,92,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.14)',
    marginBottom: 22,
  },

  demoText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    flex: 1,
    lineHeight: 15,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -3,
    marginBottom: 20,
  },

  forgotText: {
    color: THEME.gold,
    fontSize: 11,
    fontWeight: '600',
  },

  loginButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: THEME.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  loginText: {
    color: '#050505',
    fontSize: 14,
    fontWeight: '800',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 23,
  },

  registerQuestion: {
    color: 'rgba(255,255,255,0.40)',
    fontSize: 12,
  },

  registerLink: {
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
