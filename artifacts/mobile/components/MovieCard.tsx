import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { Movie } from '@/types';
import { THEME } from '@/constants/theme';

interface MovieCardProps {
  movie: Movie;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { width: 110, height: 165 },
  md: { width: 140, height: 210 },
  lg: { width: 170, height: 255 },
};

export function MovieCard({ movie, onPress, size = 'md' }: MovieCardProps) {
  const { width, height } = SIZES[size];
  const genreColor =
    THEME.genreColors[movie.genre] ?? THEME.genreColors['Drama'];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        { width, height, backgroundColor: movie.posterColor },
        pressed && styles.pressed,
      ]}
    >
      {/* Abstract poster art */}
      <View style={[styles.posterArt, { borderColor: movie.accentColor }]} />
      <View style={[styles.accentStripe, { backgroundColor: movie.accentColor }]} />

      {/* Film icon */}
      <View style={styles.iconContainer}>
        <Feather name="film" size={28} color={movie.accentColor} style={{ opacity: 0.6 }} />
      </View>

      {/* Rating badge */}
      <View style={styles.ratingBadge}>
        <Feather name="star" size={9} color={THEME.gold} />
        <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
      </View>

      {/* Genre badge */}
      <View style={[styles.genreBadge, { backgroundColor: genreColor }]}>
        <Text style={styles.genreText}>{movie.genre}</Text>
      </View>

      {/* Bottom overlay */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{movie.year}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  posterArt: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 55,
    height: 55,
    borderRadius: 28,
    borderWidth: 1.5,
    opacity: 0.25,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    opacity: 0.8,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: THEME.gold,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  genreBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.82)',
    padding: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 16,
    marginBottom: 2,
  },
  year: {
    color: THEME.textMuted,
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
});
