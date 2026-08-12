import React from 'react';

import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';

import { Movie } from '@/types';
import { THEME } from '@/constants/theme';
import {
  formatViews,
  movieDescription,
  tagLabel,
} from '@/utils/localizedContent';

interface HeroBannerProps {
  movie: Movie;
  onPlay?: () => void;
  onInfo?: () => void;
}

export function HeroBanner({
  movie,
  onPlay,
  onInfo,
}: HeroBannerProps) {
  const { t } = useTranslation();

  const handlePlay = () => {
    Haptics.impactAsync(
      Haptics
        .ImpactFeedbackStyle
        .Medium
    );

    onPlay?.();
  };

  const handleInfo = () => {
    Haptics.impactAsync(
      Haptics
        .ImpactFeedbackStyle
        .Light
    );

    onInfo?.();
  };

  const hasViews =
    movie.viewCount !== undefined;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            movie.posterColor,
        },
      ]}
    >
      <LinearGradient
        colors={[
          movie.posterColor,
          '#17100A',
          '#080808',
        ]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 1,
          y: 1,
        }}
        style={
          StyleSheet.absoluteFill
        }
      />

      {movie.thumbnail ? (
        <Image
          source={{
            uri: movie.thumbnail,
          }}
          style={
            StyleSheet.absoluteFill
          }
          contentFit="cover"
          transition={220}
        />
      ) : (
        <>
          <View
            style={[
              styles.glowLarge,
              {
                borderColor:
                  movie.accentColor,
              },
            ]}
          />

          <View
            style={[
              styles.glowSmall,
              {
                backgroundColor:
                  movie.accentColor,
              },
            ]}
          />

          <View
            style={
              styles.filmWatermark
            }
          >
            <Feather
              name="film"
              size={130}
              color={
                movie.accentColor
              }
            />
          </View>
        </>
      )}

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.14)',
          'rgba(0,0,0,0.24)',
          'rgba(0,0,0,0.76)',
        ]}
        locations={[
          0,
          0.50,
          1,
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      <View style={styles.topRow}>
        <View
          style={
            styles.originalBadge
          }
        >
          <View
            style={
              styles.originalDot
            }
          />

          <Text
            style={
              styles.originalText
            }
            numberOfLines={1}
          >
            {movie.productionName ??
              t('home.original')}
          </Text>
        </View>

        <View
          style={
            styles.featuredBadge
          }
        >
          <Feather
            name="star"
            size={12}
            color="#080808"
          />

          <Text
            style={
              styles.featuredText
            }
          >
            {t('home.featured')}
          </Text>
        </View>
      </View>

      <View
        style={
          styles.glassWrapper
        }
      >
        <BlurView
          intensity={75}
          tint="dark"
          experimentalBlurMethod={
            Platform.OS ===
            'android'
              ? 'dimezisBlurView'
              : undefined
          }
          style={
            StyleSheet.absoluteFill
          }
        />

        <View
          style={
            styles.glassTint
          }
        />

        <View style={styles.content}>
          <View style={styles.tags}>
            {movie.tags
              .slice(0, 3)
              .map((tag) => (
                <View
                  key={tag}
                  style={styles.tag}
                >
                  <Text
                    style={
                      styles.tagText
                    }
                  >
                    {tagLabel(t, tag)}
                  </Text>
                </View>
              ))}
          </View>

          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {movie.title}
          </Text>

          <View style={styles.meta}>
            {(hasViews ||
              movie.rating !==
                undefined) && (
              <>
                <View
                  style={
                    styles.rating
                  }
                >
                  <Feather
                    name={
                      hasViews
                        ? 'eye'
                        : 'star'
                    }
                    size={13}
                    color={
                      THEME.goldLight
                    }
                  />

                  <Text
                    style={
                      styles.ratingText
                    }
                  >
                    {hasViews
                      ? formatViews(
                          movie.viewCount
                        )
                      : movie.rating?.toFixed(
                          1
                        )}
                  </Text>
                </View>

                <View
                  style={styles.dot}
                />
              </>
            )}

            <Text
              style={
                styles.metaText
              }
            >
              {movie.year}
            </Text>

            <View
              style={styles.dot}
            />

            <Text
              style={
                styles.metaText
              }
            >
              {movie.duration}
            </Text>
          </View>

          <Text
            style={
              styles.description
            }
            numberOfLines={2}
          >
            {movieDescription(
              t,
              movie
            )}
          </Text>

          <View
            style={styles.actions}
          >
            <Pressable
              onPress={handlePlay}
              style={({ pressed }) => [
                styles.playButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Feather
                name="play"
                size={18}
                color="#080808"
              />

              <Text
                style={
                  styles.playText
                }
              >
                {t('home.watch')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleInfo}
              style={({ pressed }) => [
                styles.infoButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Feather
                name="info"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.infoText
                }
              >
                {t('home.details')}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.circleButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Feather
                name="plus"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 440,
    marginHorizontal: 16,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.10)',
    backgroundColor: '#080808',
  },

  glowLarge: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    right: -100,
    top: -70,
    borderWidth: 1.5,
    opacity: 0.25,
  },

  glowSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 60,
    right: 35,
    opacity: 0.12,
  },

  filmWatermark: {
    position: 'absolute',
    left: 25,
    top: 85,
    opacity: 0.08,
    transform: [
      {
        rotate: '-10deg',
      },
    ],
  },

  topRow: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    gap: 10,
  },

  originalBadge: {
    maxWidth: '62%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor:
      'rgba(0,0,0,0.52)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  originalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor:
      THEME.gold,
  },

  originalText: {
    flexShrink: 1,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor:
      THEME.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },

  featuredText: {
    color: '#080808',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  glassWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.14)',
  },

  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(8,8,8,0.58)',
  },

  content: {
    padding: 18,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 10,
  },

  tag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor:
      'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.10)',
  },

  tagText: {
    color:
      'rgba(255,255,255,0.78)',
    fontSize: 10,
    fontWeight: '500',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 9,
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  ratingText: {
    color: THEME.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },

  metaText: {
    color:
      'rgba(255,255,255,0.64)',
    fontSize: 12,
    fontWeight: '500',
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor:
      'rgba(255,255,255,0.38)',
  },

  description: {
    marginTop: 10,
    color:
      'rgba(255,255,255,0.70)',
    fontSize: 13,
    lineHeight: 19,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },

  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 16,
    backgroundColor:
      THEME.gold,
  },

  playText: {
    color: '#080808',
    fontSize: 14,
    fontWeight: '800',
  },

  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor:
      'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.12)',
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.96,
      },
    ],
  },
});
