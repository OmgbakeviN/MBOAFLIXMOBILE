import React from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  LanguagePreference,
  useLanguage,
} from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();

  const {
    language,
    changeLanguage,
  } = useLanguage();

  const {
    autoplayVideos,
    preferCaptions,
    setAutoplayVideos,
    setPreferCaptions,
    resetPlaybackSettings,
  } = useSettings();

  const version =
    Constants.expoConfig?.version ??
    '1.0.0';

  const handleSignOut = () => {
    Alert.alert(
      t('settings.signOut'),
      t('settings.signOutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace(
              '/(tabs)/profile' as never
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            name="arrow-left"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            {t('settings.eyebrow')}
          </Text>
          <Text style={styles.title}>
            {t('settings.title')}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <SettingsSection
          title={t('settings.account')}
        >
          <InfoRow
            icon="user"
            title={
              isAuthenticated
                ? user?.name ?? t('settings.member')
                : t('settings.guest')
            }
            subtitle={
              isAuthenticated
                ? user?.email ?? ''
                : t('settings.guestDescription')
            }
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings.languageSection')}
          subtitle={t('settings.languageDescription')}
        >
          <LanguageOption
            value="system"
            selected={language === 'system'}
            title={t('profile.system')}
            onChange={changeLanguage}
          />

          <LanguageOption
            value="fr"
            selected={language === 'fr'}
            title={t('profile.french')}
            onChange={changeLanguage}
          />

          <LanguageOption
            value="en"
            selected={language === 'en'}
            title={t('profile.english')}
            onChange={changeLanguage}
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings.playback')}
          subtitle={t('settings.playbackDescription')}
        >
          <ToggleRow
            icon="play"
            title={t('settings.autoplay')}
            subtitle={t('settings.autoplayDescription')}
            value={autoplayVideos}
            onValueChange={setAutoplayVideos}
          />

          <ToggleRow
            icon="book-open"
            title={t('settings.captions')}
            subtitle={t('settings.captionsDescription')}
            value={preferCaptions}
            onValueChange={setPreferCaptions}
          />

          <ActionRow
            icon="refresh-cw"
            title={t('settings.resetPlayback')}
            subtitle={t('settings.resetPlaybackDescription')}
            onPress={() => {
              Haptics.selectionAsync();
              resetPlaybackSettings();
            }}
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings.nkap')}
        >
          <ActionRow
            icon="star"
            title={t('settings.openNkap')}
            subtitle={t('settings.openNkapDescription')}
            onPress={() =>
              router.push('/ai')
            }
          />
        </SettingsSection>

        <SettingsSection
          title={t('settings.about')}
        >
          <InfoRow
            icon="info"
            title={t('settings.version')}
            subtitle={`MBOA FLIX ${version}`}
          />

          <InfoRow
            icon="video"
            title={t('settings.videoHosting')}
            subtitle={t('settings.videoHostingValue')}
          />

          <View style={styles.noticeCard}>
            <Feather
              name="shield"
              size={18}
              color={THEME.gold}
            />
            <Text style={styles.noticeText}>
              {t('settings.youtubeNotice')}
            </Text>
          </View>
        </SettingsSection>

        {isAuthenticated && (
          <Pressable
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="log-out"
              size={17}
              color="#E85A5A"
            />
            <Text style={styles.signOutText}>
              {t('settings.signOut')}
            </Text>
          </Pressable>
        )}

        <Text style={styles.footer}>
          {t('settings.footer')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {subtitle && (
        <Text style={styles.sectionSubtitle}>
          {subtitle}
        </Text>
      )}

      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );
}

function LanguageOption({
  value,
  selected,
  title,
  onChange,
}: {
  value: LanguagePreference;
  selected: boolean;
  title: string;
  onChange: (
    value: LanguagePreference
  ) => Promise<void>;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onChange(value);
      }}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowIcon}>
        <Feather
          name="globe"
          size={17}
          color={
            selected
              ? THEME.gold
              : 'rgba(255,255,255,0.52)'
          }
        />
      </View>

      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
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

function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (
    value: boolean
  ) => Promise<void>;
}) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.rowIcon}>
        <Feather
          name={icon}
          size={17}
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

      <Switch
        value={value}
        onValueChange={(next) => {
          Haptics.selectionAsync();
          onValueChange(next);
        }}
        trackColor={{
          false: '#282828',
          true: 'rgba(216,178,92,0.45)',
        }}
        thumbColor={
          value ? THEME.gold : '#8A8A8A'
        }
      />
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rowIcon}>
        <Feather
          name={icon}
          size={17}
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
        color="rgba(255,255,255,0.26)"
      />
    </Pressable>
  );
}

function InfoRow({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.rowIcon}>
        <Feather
          name={icon}
          size={17}
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
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: THEME.gold,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.7,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 3,
  },
  content: {
    paddingHorizontal: 17,
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
    marginBottom: 10,
  },
  sectionCard: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionRow: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.055)',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(216,178,92,0.055)',
  },
  optionText: {
    flex: 1,
    color: 'rgba(255,255,255,0.68)',
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: THEME.goldLight,
  },
  actionRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.055)',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.065)',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rowSubtitle: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 4,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 15,
  },
  noticeText: {
    flex: 1,
    color: 'rgba(255,255,255,0.48)',
    fontSize: 10,
    lineHeight: 16,
  },
  signOutButton: {
    minHeight: 54,
    marginTop: 24,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(232,90,90,0.18)',
    backgroundColor: 'rgba(232,90,90,0.05)',
  },
  signOutText: {
    color: '#E85A5A',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    color: 'rgba(255,255,255,0.20)',
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 22,
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.70,
  },
});
