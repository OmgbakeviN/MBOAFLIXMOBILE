import React from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { MainButton } from '@/components/MainButton';
import { MOVIES } from '@/data/movies';
import { THEME } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 340;

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const movie = MOVIES.find((m) => m.id === id) ?? MOVIES[0];

  const genreColor =
    THEME.genreColors[movie.genre] ?? THEME.genreColors['Drama'];

  return (
    <View style={styles.root}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: movie.posterColor }]}>
        {/* Abstract art */}
        <View style={[styles.circle1, { borderColor: movie.accentColor }]} />
        <View style={[styles.circle2, { backgroundColor: movie.accentColor }]} />

        {/* Big film icon */}
        <View style={styles.heroIcon}>
          <Feather name="film" size={100} color={movie.accentColor} style={{ opacity: 0.12 }} />
        </View>

        {/* Rating overlay */}
        <View style={styles.ratingOverlay}>
          <Feather name="star" size={14} color={THEME.gold} />
          <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.6)', 'rgba(10,10,10,0.98)']}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Back button */}
        <SafeAreaView edges={['top']} style={styles.backSafeArea}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
        </SafeAreaView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Genre badge */}
        <View style={[styles.genreBadge, { backgroundColor: genreColor }]}>
          <Text style={styles.genreText}>{movie.genre}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{movie.title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          <Feather name="star" size={14} color={THEME.gold} />
          <Text style={styles.metaItem}>{movie.rating.toFixed(1)}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaItem}>{movie.year}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaItem}>{movie.duration}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          {movie.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <MainButton label="Play" icon="play" variant="primary" fullWidth />
          </View>
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Feather name="bookmark" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Feather name="share-2" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Synopsis</Text>
          <Text style={styles.description}>{movie.description}</Text>
        </View>

        {/* Director */}
        {movie.director && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Director</Text>
            <View style={styles.personRow}>
              <View style={styles.personAvatar}>
                <Feather name="video" size={16} color={THEME.gold} />
              </View>
              <Text style={styles.personName}>{movie.director}</Text>
            </View>
          </View>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Cast</Text>
            <View style={styles.castList}>
              {movie.cast.map((name) => (
                <View key={name} style={styles.castItem}>
                  <View style={styles.castAvatar}>
                    <Feather name="user" size={18} color={THEME.textMuted} />
                  </View>
                  <Text style={styles.castName} numberOfLines={1}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* More Like This placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>More Like This</Text>
          <View style={styles.morePlaceholder}>
            <Feather name="film" size={28} color={THEME.textMuted} />
            <Text style={styles.morePlaceholderText}>
              Recommendations coming soon
            </Text>
          </View>
        </View>

        {Platform.OS === 'web' && <View style={{ height: 34 }} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  hero: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    opacity: 0.2,
  },
  circle2: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.1,
  },
  heroIcon: {
    position: 'absolute',
    left: 20,
    top: 80,
  },
  ratingOverlay: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: THEME.gold,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  backSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: -24,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  genreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  title: {
    color: THEME.text,
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    lineHeight: 32,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  metaItem: {
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },
  tag: {
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 28,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  description: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personName: {
    color: THEME.text,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  castList: {
    flexDirection: 'row',
    gap: 16,
  },
  castItem: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  castAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  castName: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  morePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: THEME.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 10,
  },
  morePlaceholderText: {
    color: THEME.textMuted,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
