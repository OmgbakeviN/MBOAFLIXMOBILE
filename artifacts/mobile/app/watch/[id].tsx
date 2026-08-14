import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';
import { MboaYouTubePlayer } from '@/components/MboaYouTubePlayer';
import { THEME } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { MOVIES } from '@/data/movies';
import {
  formatViews,
  genreLabel,
  movieDescription,
} from '@/utils/localizedContent';

export default function WatchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width: screenWidth } =
    useWindowDimensions();

  const {
    currentLanguage,
  } = useLanguage();

  const {
    autoplayVideos,
    preferCaptions,
    isReady: settingsReady,
  } = useSettings();

  const params =
    useLocalSearchParams<{
      id?: string | string[];
      source?: string | string[];
    }>();

  const movieId = Array.isArray(
    params.id
  )
    ? params.id[0]
    : params.id;

  const sourceParam = Array.isArray(
    params.source
  )
    ? params.source[0]
    : params.source;

  const isTrailer =
    sourceParam === 'trailer';

  const movie = MOVIES.find(
    (item) =>
      item.id === movieId
  );

  const youtubeSource = movie
    ? isTrailer
      ? movie.trailerYoutube
      : movie.youtube
    : undefined;

  const [playing, setPlaying] =
    useState(autoplayVideos);

  const [playerError, setPlayerError] =
    useState<string | null>(null);

  useEffect(() => {
    if (
      settingsReady &&
      autoplayVideos
    ) {
      setPlaying(true);
    }
  }, [
    settingsReady,
    autoplayVideos,
    movieId,
    sourceParam,
  ]);

  const playerWidth = Math.min(
    screenWidth,
    980
  );
  const playerHeight =
    playerWidth * (9 / 16);

  const nextEpisode = useMemo(() => {
    if (
      !movie?.seriesId ||
      movie.episodeNumber ===
        undefined
    ) {
      return undefined;
    }

    return MOVIES.filter(
      (item) =>
        item.seriesId ===
          movie.seriesId &&
        item.contentType ===
          'episode' &&
        item.episodeNumber !==
          undefined &&
        item.episodeNumber >
          movie.episodeNumber!
    ).sort(
      (a, b) =>
        (a.episodeNumber ?? 0) -
        (b.episodeNumber ?? 0)
    )[0];
  }, [movie]);

  if (!movie) {
    return (
      <UnavailableScreen
        title={t(
          'player.unavailable'
        )}
        message={t(
          'player.contentNotFound'
        )}
        onBack={() =>
          router.back()
        }
      />
    );
  }

  if (!youtubeSource) {
    return (
      <UnavailableScreen
        title={t(
          'player.unavailable'
        )}
        message={t(
          'player.unavailableText'
        )}
        onBack={() =>
          router.back()
        }
      />
    );
  }

  const episodeLabel =
    movie.contentType ===
      'episode' &&
    movie.episodeNumber
      ? t('player.episode', {
          season:
            movie.seasonNumber ?? 1,
          episode:
            movie.episodeNumber,
        })
      : undefined;

  const openYouTube = () => {
    Haptics.selectionAsync();
    Linking.openURL(
      youtubeSource.url
    ).catch((error) =>
      console.warn(
        'Unable to open YouTube.',
        error
      )
    );
  };

  const handleBack = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    // Stop the WebView before leaving the player, then return directly
    // to the content detail. This avoids the empty watch stack / black screen.
    setPlaying(false);
    router.replace(
      `/movie/${movie.id}` as never
    );
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top', 'bottom']}
    >
      <StatusBar
        barStyle="light-content"
      />

      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
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
            {isTrailer
              ? t('player.trailer')
              : t('player.eyebrow')}
          </Text>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {movie.title}
          </Text>
        </View>

        <Pressable
          onPress={openYouTube}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            name="arrow-up-right"
            size={19}
            color={THEME.gold}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.playerShell}>
          <MboaYouTubePlayer
            videoId={youtubeSource.videoId}
            width={playerWidth}
            height={playerHeight}
            playing={playing}
            captionLanguage={currentLanguage}
            preferCaptions={preferCaptions}
            title={movie.title}
            onChangeState={(state) => {
              if (state === 'playing') {
                setPlaying(true);
                setPlayerError(null);
              }

              if (
                state === 'paused' ||
                state === 'ended'
              ) {
                setPlaying(false);
              }
            }}
            onError={(error) => {
              setPlayerError(error);
              setPlaying(false);
            }}
          />
        </View>

        {playerError && (
          <View style={styles.errorCard}>
            <Feather
              name="alert-circle"
              size={18}
              color="#E7A95C"
            />
            <View style={styles.errorTextBlock}>
              <Text style={styles.errorTitle}>
                {t('player.playbackError')}
              </Text>
              <Text style={styles.errorText}>
                {t('player.playbackErrorHint')}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isTrailer
                  ? t('player.trailer')
                  : movie.contentType === 'short'
                    ? t('movie.shortBadge')
                    : movie.contentType === 'episode'
                      ? t('movie.episodeBadge', {
                          number:
                            movie.episodeNumber ?? 1,
                        })
                      : t('movie.movieBadge')}
              </Text>
            </View>

            {episodeLabel && (
              <Text style={styles.episodeLabel}>
                {episodeLabel}
              </Text>
            )}
          </View>

          <Text style={styles.title}>
            {movie.title}
          </Text>

          {movie.seriesTitle && (
            <Text style={styles.seriesTitle}>
              {movie.seriesTitle}
            </Text>
          )}

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {movie.year}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>
              {movie.duration}
            </Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>
              {genreLabel(
                t,
                movie.genre
              )}
            </Text>
            {movie.viewCount !== undefined && (
              <>
                <View style={styles.dot} />
                <Feather
                  name="eye"
                  size={12}
                  color={THEME.goldLight}
                />
                <Text style={styles.metaText}>
                  {formatViews(
                    movie.viewCount
                  )}
                </Text>
              </>
            )}
          </View>

          <View style={styles.hostCard}>
            <View style={styles.youtubeMark}>
              <Feather
                name="play"
                size={18}
                color="#050505"
              />
            </View>

            <View style={styles.hostText}>
              <Text style={styles.hostTitle}>
                {t('player.hostedBy', {
                  channel:
                    youtubeSource.channelName ??
                    movie.productionName ??
                    'YouTube',
                })}
              </Text>
              <Text style={styles.hostNotice}>
                {t('player.embeddedNotice')}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={openYouTube}
            style={({ pressed }) => [
              styles.openYouTubeButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="arrow-up-right"
              size={17}
              color={THEME.gold}
            />
            <Text style={styles.secondaryButtonText}>
              {t('player.openYouTube')}
            </Text>
          </Pressable>

          {isTrailer && movie.youtube && (
            <Pressable
              onPress={() =>
                router.replace(
                  `/watch/${movie.id}` as never
                )
              }
              style={({ pressed }) => [
                styles.fullVersionButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather
                name="film"
                size={18}
                color={THEME.gold}
              />
              <View style={styles.fullVersionText}>
                <Text style={styles.fullVersionTitle}>
                  {t('player.fullVersion')}
                </Text>
                <Text style={styles.fullVersionSubtitle}>
                  {movie.duration}
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color="rgba(255,255,255,0.28)"
              />
            </Pressable>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('movie.synopsis')}
            </Text>
            <Text style={styles.description}>
              {movieDescription(t, movie)}
            </Text>
          </View>

          {!isTrailer && nextEpisode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('player.nextEpisode')}
              </Text>

              <Pressable
                onPress={() =>
                  router.replace(
                    `/watch/${nextEpisode.id}` as never
                  )
                }
                style={({ pressed }) => [
                  styles.nextCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.nextIcon}>
                  <Feather
                    name="play"
                    size={19}
                    color={THEME.gold}
                  />
                </View>

                <View style={styles.nextText}>
                  <Text style={styles.nextTitle}>
                    {nextEpisode.title}
                  </Text>
                  <Text style={styles.nextSubtitle}>
                    {t('player.watchNext')}
                  </Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={19}
                  color="rgba(255,255,255,0.30)"
                />
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={() =>
              router.push(
                `/movie/${movie.id}` as never
              )
            }
            style={({ pressed }) => [
              styles.backDetailsButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="info"
              size={17}
              color={THEME.gold}
            />
            <Text style={styles.backDetailsText}>
              {t('player.backToDetails')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnavailableScreen({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.unavailable}>
        <Feather
          name="alert-circle"
          size={38}
          color={THEME.gold}
        />
        <Text style={styles.unavailableTitle}>
          {title}
        </Text>
        <Text style={styles.unavailableText}>
          {message}
        </Text>
        <Pressable
          onPress={onBack}
          style={styles.primaryButton}
        >
          <Feather
            name="arrow-left"
            size={17}
            color="#050505"
          />
          <Text style={styles.primaryButtonText}>
            {t('common.back')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerButton: {
    width: 42,
    height: 42,
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
    letterSpacing: 1.4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  content: {
    paddingBottom: 48,
  },
  playerShell: {
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  errorCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(231,169,92,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(231,169,92,0.18)',
  },
  errorTextBlock: {
    flex: 1,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  errorText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
  },
  info: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: 'rgba(216,178,92,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.18)',
  },
  badgeText: {
    color: THEME.gold,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  episodeLabel: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 9.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '800',
    marginTop: 12,
  },
  seriesTitle: {
    color: THEME.goldLight,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  metaText: {
    color: 'rgba(255,255,255,0.46)',
    fontSize: 10,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  youtubeMark: {
    width: 43,
    height: 43,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.gold,
  },
  hostText: {
    flex: 1,
  },
  hostTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  hostNotice: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: 18,
    backgroundColor: THEME.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 15,
  },
  primaryButtonText: {
    color: '#050505',
    fontSize: 11,
    fontWeight: '800',
  },
  openYouTubeButton: {
    minHeight: 52,
    marginTop: 16,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.25)',
    backgroundColor: 'rgba(216,178,92,0.06)',
  },

  secondaryButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 13,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  secondaryButtonText: {
    color: THEME.goldLight,
    fontSize: 10.5,
    fontWeight: '700',
  },
  fullVersionButton: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(216,178,92,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.15)',
  },
  fullVersionText: {
    flex: 1,
  },
  fullVersionTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fullVersionSubtitle: {
    color: 'rgba(255,255,255,0.34)',
    fontSize: 9,
    marginTop: 4,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    lineHeight: 21,
  },
  nextCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  nextIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.07)',
  },
  nextText: {
    flex: 1,
  },
  nextTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  nextSubtitle: {
    color: THEME.gold,
    fontSize: 9,
    marginTop: 5,
  },
  backDetailsButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  backDetailsText: {
    color: THEME.goldLight,
    fontSize: 10.5,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  unavailableTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 15,
    textAlign: 'center',
  },
  unavailableText: {
    color: 'rgba(255,255,255,0.43)',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
});
