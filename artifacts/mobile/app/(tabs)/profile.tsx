import React from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  LanguagePreference,
  useLanguage,
} from '@/context/LanguageContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    language,
    changeLanguage,
  } = useLanguage();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

  const handleLogout = async () => {
    Haptics.selectionAsync();

    await signOut();

    Alert.alert(
      t('profile.signedOutTitle'),
      t('profile.signedOutMessage')
    );
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            {t('profile.eyebrow')}
          </Text>

          <Text style={styles.title}>
            {t('profile.title')}
          </Text>
        </View>

        {!isAuthenticated ? (
          <View style={styles.guestCard}>
            <View style={styles.avatar}>
              <Feather
                name="user"
                size={31}
                color={THEME.gold}
              />
            </View>

            <Text style={styles.guestTitle}>
              {t('profile.welcome')}
            </Text>

            <Text style={styles.guestText}>
              {t('profile.guestText')}
            </Text>

            <Pressable
              onPress={() =>
                router.push('/login')
              }
              style={styles.primaryButton}
            >
              <Text style={styles.primaryText}>
                {t('profile.signIn')}
              </Text>

              <Feather
                name="arrow-right"
                size={17}
                color="#050505"
              />
            </Pressable>

            <Pressable
              onPress={() =>
                router.push('/register')
              }
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryText}>
                {t('profile.createAccount')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.memberCard}>
              <View style={styles.avatar}>
                <Text style={styles.initial}>
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase() ?? 'M'}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {user?.name}
                </Text>

                <Text style={styles.memberEmail}>
                  {user?.email}
                </Text>

                <View style={styles.memberBadge}>
                  <Feather
                    name="check-circle"
                    size={12}
                    color={THEME.gold}
                  />

                  <Text style={styles.memberBadgeText}>
                    {t('profile.member')}
                  </Text>
                </View>
              </View>
            </View>

            <ProfileRow
              icon="bookmark"
              title={t('profile.myList')}
              subtitle={t('profile.myListSubtitle')}
            />

            <ProfileRow
              icon="credit-card"
              title={t('profile.subscription')}
              subtitle={t('profile.subscriptionSubtitle')}
            />

            <ProfileRow
              icon="settings"
              title={t('profile.settings')}
              subtitle={t('profile.settingsSubtitle')}
            />
          </>
        )}

        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>
            {t('profile.languageTitle')}
          </Text>

          <LanguageOption
            title={t('profile.system')}
            value="system"
            selected={language === 'system'}
            onPress={changeLanguage}
          />

          <LanguageOption
            title={t('profile.french')}
            value="fr"
            selected={language === 'fr'}
            onPress={changeLanguage}
          />

          <LanguageOption
            title={t('profile.english')}
            value="en"
            selected={language === 'en'}
            onPress={changeLanguage}
          />
        </View>

        {isAuthenticated && (
          <Pressable
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Feather
              name="log-out"
              size={17}
              color="#E85A5A"
            />

            <Text style={styles.logoutText}>
              {t('profile.signOut')}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LanguageOption({
  title,
  value,
  selected,
  onPress,
}: {
  title: string;
  value: LanguagePreference;
  selected: boolean;
  onPress: (
    value: LanguagePreference
  ) => Promise<void>;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress(value);
      }}
      style={[
        styles.languageOption,
        selected &&
          styles.languageOptionSelected,
      ]}
    >
      <View style={styles.languageIcon}>
        <Feather
          name="globe"
          size={17}
          color={
            selected
              ? THEME.gold
              : 'rgba(255,255,255,0.48)'
          }
        />
      </View>

      <Text
        style={[
          styles.languageOptionText,
          selected &&
            styles.languageOptionTextSelected,
        ]}
      >
        {title}
      </Text>

      {selected && (
        <Feather
          name="check"
          size={18}
          color={THEME.gold}
        />
      )}
    </Pressable>
  );
}

function ProfileRow({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable
      onPress={() =>
        Haptics.selectionAsync()
      }
      style={({ pressed }) => [
        styles.row,
        pressed && {
          opacity: 0.72,
        },
      ]}
    >
      <View style={styles.rowIcon}>
        <Feather
          name={icon}
          size={18}
          color={THEME.gold}
        />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Feather
        name="chevron-right"
        size={18}
        color="rgba(255,255,255,0.28)"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 130,
  },

  header: {
    paddingTop: 10,
    paddingBottom: 22,
  },

  eyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5,
  },

  guestCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.18)',
  },

  initial: {
    color: THEME.gold,
    fontSize: 27,
    fontWeight: '800',
  },

  guestTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 20,
  },

  guestText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  primaryButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: THEME.gold,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  primaryText: {
    color: '#050505',
    fontSize: 13,
    fontWeight: '800',
  },

  secondaryButton: {
    height: 52,
    borderRadius: 17,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  secondaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(216,178,92,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.14)',
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },

  memberEmail: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 11,
    marginTop: 4,
  },

  memberBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(216,178,92,0.07)',
  },

  memberBadgeText: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '700',
  },

  row: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.07)',
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  rowSubtitle: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 10,
    marginTop: 4,
  },

  languageSection: {
    marginTop: 22,
  },

  languageTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  languageOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    marginBottom: 9,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  languageOptionSelected: {
    borderColor: 'rgba(216,178,92,0.30)',
    backgroundColor: 'rgba(216,178,92,0.07)',
  },

  languageIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  languageOptionText: {
    flex: 1,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
  },

  languageOptionTextSelected: {
    color: THEME.goldLight,
  },

  logoutButton: {
    height: 52,
    borderRadius: 17,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(232,90,90,0.18)',
    backgroundColor: 'rgba(232,90,90,0.05)',
  },

  logoutText: {
    color: '#E85A5A',
    fontSize: 12,
    fontWeight: '700',
  },
});
