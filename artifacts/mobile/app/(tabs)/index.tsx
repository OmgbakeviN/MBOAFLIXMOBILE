import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { CategoryButton } from '@/components/CategoryButton';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieCard } from '@/components/MovieCard';
import { SectionTitle } from '@/components/SectionTitle';
import { CATEGORIES } from '@/data/categories';
import {
  DOCUMENTARIES,
  FEATURED_MOVIE,
  MOVIES,
  NEW_RELEASES,
  TRENDING,
} from '@/data/movies';
import { THEME } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all');

  const topPadding =
    Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        bounces
      >
        {/* Top Header */}
        <View style={[styles.topBar, { paddingTop: topPadding + 12 }]}>
          <View>
            <Text style={styles.brandName}>MBOA FLIX</Text>
            <Text style={styles.brandTagline}>Cameroonian Cinema & Culture</Text>
          </View>
          <View style={styles.topIcons}>
            <Feather name="search" size={22} color={THEME.textSecondary} />
            <Feather name="bell" size={22} color={THEME.textSecondary} />
          </View>
        </View>

        {/* Hero Banner */}
        <HeroBanner
          movie={FEATURED_MOVIE}
          onPlay={() => router.push(`/movie/${FEATURED_MOVIE.id}`)}
          onInfo={() => router.push(`/movie/${FEATURED_MOVIE.id}`)}
        />

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {CATEGORIES.slice(0, 7).map((cat) => (
              <CategoryButton
                key={cat.id}
                label={cat.label}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <SectionTitle
            title="Trending Now"
            onSeeAll={() => router.push('/explore')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {TRENDING.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="md"
                onPress={() => router.push(`/movie/${movie.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* New Releases */}
        <View style={styles.section}>
          <SectionTitle
            title="New Releases"
            onSeeAll={() => router.push('/explore')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {NEW_RELEASES.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="md"
                onPress={() => router.push(`/movie/${movie.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Promotions Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Feather name="award" size={28} color={THEME.gold} />
            <View>
              <Text style={styles.promoTitle}>African Film Heritage</Text>
              <Text style={styles.promoSub}>
                Timeless classics from 1955 to today
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={THEME.gold} />
        </View>

        {/* Documentaries */}
        <View style={styles.section}>
          <SectionTitle
            title="Documentaries"
            onSeeAll={() => router.push('/explore')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {DOCUMENTARIES.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="lg"
                onPress={() => router.push(`/movie/${movie.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* All Films Teaser */}
        <View style={styles.section}>
          <SectionTitle title="More to Discover" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {MOVIES.slice(6, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                size="sm"
                onPress={() => router.push(`/movie/${movie.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Footer tagline */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ✦ Africa in miniature. Stories without borders. ✦
          </Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  brandName: {
    color: THEME.gold,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  brandTagline: {
    color: THEME.textMuted,
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  topIcons: {
    flexDirection: 'row',
    gap: 18,
    paddingTop: 4,
  },
  categoriesSection: {
    marginTop: 20,
    marginBottom: 4,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 28,
  },
  horizontalList: {
    paddingHorizontal: 20,
    paddingRight: 8,
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoTitle: {
    color: THEME.text,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  promoSub: {
    color: THEME.textMuted,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  footer: {
    marginTop: 36,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
