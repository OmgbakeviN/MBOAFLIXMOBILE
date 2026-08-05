import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Movie } from '@/types';
import { THEME } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 460;

interface HeroBannerProps {
  movie: Movie;
  onPlay?: () => void;
  onInfo?: () => void;
}

export function HeroBanner({ movie, onPlay, onInfo }: HeroBannerProps) {
  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlay?.();
  };

  const handleInfo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInfo?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: movie.posterColor }]}>
      {/* Abstract art background */}
      <View style={[styles.circle1, { borderColor: movie.accentColor }]} />
      <View style={[styles.circle2, { backgroundColor: movie.accentColor }]} />
      <View style={[styles.circle3, { borderColor: movie.accentColor }]} />

      {/* Film reel decorative icon */}
      <View style={styles.filmIcon}>
        <Feather name="film" size={120} color={movie.accentColor} style={{ opacity: 0.08 }} />
      </View>

      {/* Gradient overlay */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(10,10,10,0.2)',
          'rgba(10,10,10,0.7)',
          'rgba(10,10,10,0.97)',
        ]}
        locations={[0, 0.3, 0.65, 1]}
        style={styles.gradient}
      />

      {/* Featured label */}
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredText}>✦ FEATURED</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Tags */}
        <View style={styles.tags}>
          {movie.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.title}>{movie.title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <Feather name="star" size={12} color={THEME.gold} />
          <Text style={styles.metaText}>{movie.rating.toFixed(1)}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{movie.year}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{movie.duration}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {movie.description}
        </Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Pressable
            onPress={handlePlay}
            style={({ pressed }) => [styles.playButton, pressed && { opacity: 0.85 }]}
          >
            <Feather name="play" size={18} color="#0A0A0A" />
            <Text style={styles.playLabel}>Play</Text>
          </Pressable>

          <Pressable
            onPress={handleInfo}
            style={({ pressed }) => [styles.infoButton, pressed && { opacity: 0.75 }]}
          >
            <Feather name="info" size={16} color="#FFFFFF" />
            <Text style={styles.infoLabel}>More Info</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    opacity: 0.18,
  },
  circle2: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
  circle3: {
    position: 'absolute',
    top: 120,
    right: 100,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 0.5,
    opacity: 0.1,
  },
  filmIcon: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: THEME.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  featuredText: {
    color: '#0A0A0A',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  tagText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    lineHeight: 36,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    color: THEME.textSecondary,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: THEME.textMuted,
  },
  description: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 19,
    marginBottom: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.gold,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 8,
  },
  playLabel: {
    color: '#0A0A0A',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
