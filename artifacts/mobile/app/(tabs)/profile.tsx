import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MainButton } from '@/components/MainButton';
import { THEME } from '@/constants/theme';

type FeatherIconName = keyof typeof Feather.glyphMap;

interface SettingRow {
  icon: FeatherIconName;
  label: string;
  value?: string;
}

const SETTING_GROUPS: Array<{ title: string; rows: SettingRow[] }> = [
  {
    title: 'Account',
    rows: [
      { icon: 'user', label: 'Edit Profile' },
      { icon: 'bell', label: 'Notifications' },
      { icon: 'lock', label: 'Privacy & Security' },
    ],
  },
  {
    title: 'Preferences',
    rows: [
      { icon: 'globe', label: 'Language', value: 'English' },
      { icon: 'download', label: 'Download Quality', value: 'HD' },
      { icon: 'wifi', label: 'Data Usage', value: 'Auto' },
    ],
  },
  {
    title: 'Support',
    rows: [
      { icon: 'help-circle', label: 'Help Center' },
      { icon: 'info', label: 'About MBOA FLIX' },
      { icon: 'star', label: 'Rate the App' },
    ],
  },
];

const STATS = [
  { label: 'Watched', value: '0' },
  { label: 'Favorites', value: '0' },
  { label: 'Watchlist', value: '0' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>Profile</Text>
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Feather name="settings" size={22} color={THEME.textSecondary} />
          </Pressable>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Feather name="user" size={42} color={THEME.textMuted} />
            </View>
          </View>
          <Text style={styles.userName}>Guest Viewer</Text>
          <Text style={styles.userEmail}>Sign in to unlock your full experience</Text>

          {/* CTA buttons */}
          <View style={styles.authButtons}>
            <MainButton label="Sign In" variant="primary" fullWidth />
            <MainButton label="Create Account" variant="outline" fullWidth />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Watchlist placeholder */}
        <View style={styles.watchlistPlaceholder}>
          <Feather name="bookmark" size={32} color={THEME.textMuted} />
          <Text style={styles.watchlistTitle}>Your Watchlist is Empty</Text>
          <Text style={styles.watchlistText}>
            Sign in to save films and access them anytime.
          </Text>
        </View>

        {/* Settings Groups */}
        {SETTING_GROUPS.map((group) => (
          <View key={group.title} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.rows.map((row, idx) => (
                <Pressable
                  key={row.label}
                  style={({ pressed }) => [
                    styles.settingRow,
                    idx < group.rows.length - 1 && styles.settingRowBorder,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconBox}>
                      <Feather name={row.icon} size={16} color={THEME.gold} />
                    </View>
                    <Text style={styles.settingLabel}>{row.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {row.value && (
                      <Text style={styles.settingValue}>{row.value}</Text>
                    )}
                    <Feather
                      name="chevron-right"
                      size={16}
                      color={THEME.textMuted}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* App version */}
        <Text style={styles.version}>MBOA FLIX · v1.0.0</Text>

        {Platform.OS === 'web' && <View style={{ height: 34 }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scroll: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 77 : 16,
    paddingBottom: 8,
  },
  topTitle: {
    color: THEME.text,
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 40,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: THEME.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: THEME.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: THEME.text,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  userEmail: {
    color: THEME.textMuted,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  authButtons: {
    width: '100%',
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 24,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: THEME.cardBorder,
  },
  statValue: {
    color: THEME.gold,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  watchlistPlaceholder: {
    alignItems: 'center',
    padding: 28,
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 10,
  },
  watchlistTitle: {
    color: THEME.text,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  watchlistText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 19,
  },
  settingGroup: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  groupTitle: {
    color: THEME.textMuted,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  groupCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    color: THEME.text,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    color: THEME.textMuted,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  version: {
    color: THEME.textMuted,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});
