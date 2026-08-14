import React, { useMemo } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Redirect,
  useRouter,
} from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from '@/components/FeatherCompat';
import { MovieCard } from '@/components/MovieCard';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { MOVIES } from '@/data/movies';

export default function WatchlistScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isReady: authReady } = useAuth();
  const {
    movieIds,
    isReady,
    removeMovie,
    clearWatchlist,
  } = useWatchlist();

  const movies = useMemo(
    () =>
      movieIds
        .map((id) => MOVIES.find((movie) => movie.id === id))
        .filter((movie): movie is NonNullable<typeof movie> => Boolean(movie)),
    [movieIds]
  );

  if (!authReady || !isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="small"
          color={THEME.gold}
        />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Redirect
        href={{
          pathname: '/login',
          params: {
            redirect: '/watchlist',
          },
        }}
      />
    );
  }

  const handleClear = async () => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    );
    await clearWatchlist();
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
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
            {t('watchlist.eyebrow')}
          </Text>
          <Text style={styles.title}>
            {t('watchlist.title')}
          </Text>
        </View>

        {movies.length > 0 ? (
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.clearText}>
              {t('watchlist.clear')}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.countText}>
          {t('watchlist.count', {
            count: movies.length,
          })}
        </Text>

        {movies.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Feather
                name="bookmark"
                size={28}
                color={THEME.gold}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {t('watchlist.emptyTitle')}
            </Text>

            <Text style={styles.emptyText}>
              {t('watchlist.emptyText')}
            </Text>

            <Pressable
              onPress={() =>
                router.replace('/(tabs)/explore' as never)
              }
              style={({ pressed }) => [
                styles.exploreButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather
                name="search"
                size={17}
                color="#050505"
              />
              <Text style={styles.exploreButtonText}>
                {t('watchlist.explore')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {movies.map((movie) => (
              <View
                key={movie.id}
                style={styles.gridItem}
              >
                <MovieCard
                  movie={movie}
                  size="md"
                  onPress={() =>
                    router.push(
                      `/movie/${movie.id}` as never
                    )
                  }
                />

                <Pressable
                  accessibilityLabel={t('watchlist.remove')}
                  onPress={async () => {
                    Haptics.selectionAsync();
                    await removeMovie(movie.id);
                  }}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Feather
                    name="x"
                    size={15}
                    color="#FFFFFF"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.background,
  },
  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerButton: {
    width: 43,
    height: 43,
    borderRadius: 17,
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
    letterSpacing: 1.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 3,
  },
  clearButton: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232,90,90,0.18)',
    backgroundColor: 'rgba(232,90,90,0.05)',
  },
  clearText: {
    color: '#E98A8A',
    fontSize: 10,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 50,
  },
  countText: {
    color: 'rgba(255,255,255,0.40)',
    fontSize: 11,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  gridItem: {
    position: 'relative',
    width: '48%',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 9,
    right: 6,
    width: 31,
    height: 31,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.74)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.17)',
  },
  emptyCard: {
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.16)',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    textAlign: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 290,
  },
  exploreButton: {
    minHeight: 50,
    marginTop: 20,
    paddingHorizontal: 18,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.gold,
  },
  exploreButtonText: {
    color: '#050505',
    fontSize: 12,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.72,
  },
});
