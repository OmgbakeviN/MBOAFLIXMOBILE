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
import { useWatchlist } from '@/context/WatchlistContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    user,
    isAuthenticated,
    signOut,
  } = useAuth();


  const { movieIds } = useWatchlist();

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
              subtitle={t('profile.myListCount', {
                count: movieIds.length,
              })}
              onPress={() =>
                router.push('/watchlist')
              }
            />

            <ProfileRow
              icon="credit-card"
              title={t('profile.subscription')}
              subtitle={t('profile.subscriptionSubtitle')}
            />
          </>
        )}

        <ProfileRow
          icon="settings"
          title={t('profile.settings')}
          subtitle={t('profile.settingsSubtitle')}
          onPress={() =>
            router.push('/settings')
          }
        />

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

function ProfileRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.pressed,
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
    marginBottom: 14,
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
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
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
