import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';

import { Movie } from '@/types';
import { THEME } from '@/constants/theme';
import {
  contentTypeLabel,
  formatViews,
  genreLabel,
} from '@/utils/localizedContent';

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  rank?: number;
}

const SIZES = {
  sm: {
    width: 122,
    height: 184,
  },
  md: {
    width: 152,
    height: 228,
  },
  lg: {
    width: 178,
    height: 260,
  },
};

export function MovieCard({
  movie,
  onPress,
  size = 'md',
  rank,
}: MovieCardProps) {
  const { t } = useTranslation();
  const dimensions = SIZES[size];

  const handlePress = () => {
    Haptics.impactAsync(
      Haptics
        .ImpactFeedbackStyle
        .Light
    );

    onPress?.();
  };

  const hasViews =
    movie.viewCount !== undefined;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[
          movie.posterColor,
          '#151515',
          '#050505',
        ]}
        style={StyleSheet.absoluteFill}
      />

      {movie.thumbnail ? (
        <Image
          source={{
            uri: movie.thumbnail,
          }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={180}
        />
      ) : (
        <>
          <View
            style={[
              styles.posterCircle,
              {
                borderColor:
                  movie.accentColor,
              },
            ]}
          />

          <View
            style={[
              styles.posterGlow,
              {
                backgroundColor:
                  movie.accentColor,
              },
            ]}
          />

          <View style={styles.centerIcon}>
            <Feather
              name="film"
              size={34}
              color={movie.accentColor}
            />

            <Text style={styles.mboaText}>
              MBOA
            </Text>
          </View>
        </>
      )}

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.05)',
          'rgba(0,0,0,0.18)',
          'rgba(0,0,0,0.96)',
        ]}
        locations={[0, 0.47, 1]}
        style={StyleSheet.absoluteFill}
      />

      {rank ? (
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>
            TOP {rank}
          </Text>
        </View>
      ) : (
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {contentTypeLabel(t, movie)}
          </Text>
        </View>
      )}

      {(hasViews ||
        movie.rating !== undefined) && (
        <View style={styles.metricBadge}>
          <Feather
            name={
              hasViews
                ? 'eye'
                : 'star'
            }
            size={10}
            color={THEME.goldLight}
          />

          <Text style={styles.metricText}>
            {hasViews
              ? formatViews(
                  movie.viewCount
                )
              : movie.rating?.toFixed(
                  1
                )}
          </Text>
        </View>
      )}

      <View style={styles.bottom}>
        <View
          style={[
            styles.genreDot,
            {
              backgroundColor:
                movie.accentColor,
            },
          ]}
        />

        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {movie.title}
        </Text>

        <View style={styles.meta}>
          <Text style={styles.year}>
            {movie.year}
          </Text>

          <Text style={styles.metaDot}>
            •
          </Text>

          <Text
            style={styles.genre}
            numberOfLines={1}
          >
            {genreLabel(
              t,
              movie.genre
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 13,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.09)',
    backgroundColor: '#0A0A0A',
  },

  pressed: {
    opacity: 0.84,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  posterCircle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.2,
    top: 25,
    right: -45,
    opacity: 0.28,
  },

  posterGlow: {
    position: 'absolute',
    width: 75,
    height: 75,
    borderRadius: 40,
    left: 15,
    top: 55,
    opacity: 0.08,
  },

  centerIcon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '32%',
    alignItems: 'center',
    opacity: 0.58,
  },

  mboaText: {
    marginTop: 6,
    color:
      'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
  },

  rankBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor:
      'rgba(212,175,55,0.16)',
    borderWidth: 1,
    borderColor:
      'rgba(212,175,55,0.32)',
  },

  rankText: {
    color: THEME.goldLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor:
      'rgba(0,0,0,0.62)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.10)',
  },

  typeText: {
    color:
      'rgba(255,255,255,0.88)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  metricBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor:
      'rgba(0,0,0,0.66)',
    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.08)',
  },

  metricText: {
    color: THEME.goldLight,
    fontSize: 10,
    fontWeight: '700',
  },

  bottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },

  genreDot: {
    width: 20,
    height: 3,
    borderRadius: 5,
    marginBottom: 7,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },

  year: {
    color:
      'rgba(255,255,255,0.48)',
    fontSize: 10,
  },

  genre: {
    flexShrink: 1,
    color:
      'rgba(255,255,255,0.48)',
    fontSize: 10,
  },

  metaDot: {
    color:
      'rgba(255,255,255,0.25)',
    fontSize: 9,
  },
});
