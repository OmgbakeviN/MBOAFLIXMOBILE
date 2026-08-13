import React, {
  useMemo,
  useState,
} from 'react';

import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Feather from '@/components/FeatherCompat';

import { BlurView } from 'expo-blur';

import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import { CategoryButton } from '@/components/CategoryButton';
import { DocumentaryCard } from '@/components/DocumentaryCard';

import { HeroBanner } from '@/components/HeroBanner';

import { MovieCard } from '@/components/MovieCard';

import { SectionTitle } from '@/components/SectionTitle';

import { CATEGORIES } from '@/data/categories';
import { DOCUMENTARIES } from '@/data/documentaries';

import {
  FEATURED_MOVIE,
  MOVIES,
  NEW_RELEASES,
  SERIES_EPISODES,
  SHORTS,
  TRENDING,
} from '@/data/movies';

import { THEME } from '@/constants/theme';
import { categoryLabel } from '@/utils/localizedContent';

interface GlassIconProps {
  icon:
    | 'search'
    | 'bell'
    | 'user';
  onPress?: () => void;
}

function GlassIconButton({
  icon,
  onPress,
}: GlassIconProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glassIconButton,

        pressed && {
          opacity: 0.65,
          transform: [
            {
              scale: 0.94,
            },
          ],
        },
      ]}
    >
      <BlurView
        intensity={55}
        tint="dark"
        experimentalBlurMethod={
          Platform.OS === 'android'
            ? 'dimezisBlurView'
            : undefined
        }
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glassIconTint} />

      <Feather
        name={icon}
        size={19}
        color="#FFFFFF"
      />
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  const [activeCategory, setActiveCategory] =
    useState('all');

  const topPadding =
    Platform.OS === 'web'
      ? 24
      : insets.top + 8;

  const visibleMovies = useMemo(() => {
    if (activeCategory === 'all') {
      return TRENDING;
    }

    const filtered = MOVIES.filter(
      (movie) =>
        movie.genre.toLowerCase() ===
          activeCategory.toLowerCase() ||
        movie.tags.some(
          (tag) =>
            tag.toLowerCase() ===
            activeCategory.toLowerCase()
        )
    );

    return filtered.length > 0
      ? filtered
      : TRENDING;
  }, [activeCategory]);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* HEADER */}

        <View
          style={[
            styles.header,
            {
              paddingTop: topPadding,
            },
          ]}
        >
          <View>
            <Text style={styles.logo}>
              MBOA
              <Text style={styles.logoAccent}>
                {' '}FLIX
              </Text>
            </Text>

            <Text style={styles.tagline}>
              {t('home.tagline')}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <GlassIconButton
              icon="search"
              onPress={() =>
                router.push('/explore')
              }
            />

            <GlassIconButton
              icon="bell"
              onPress={() =>
                Haptics.selectionAsync()
              }
            />
          </View>
        </View>

        {/* HERO */}

        <HeroBanner
          movie={FEATURED_MOVIE}
          onPlay={() =>
            router.push(
              `/movie/${FEATURED_MOVIE.id}`
            )
          }
          onInfo={() =>
            router.push(
              `/movie/${FEATURED_MOVIE.id}`
            )
          }
        />

        {/* CATEGORY FILTER */}

        <View style={styles.categories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoriesContent
            }
          >
            {CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                label={categoryLabel(t, category.id, category.label)}
                active={
                  activeCategory ===
                  category.id
                }
                onPress={() =>
                  setActiveCategory(
                    category.id
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* TRENDING */}

        <View style={styles.section}>
          <SectionTitle
            title={
              activeCategory === 'all'
                ? t('home.trending')
                : t('labels.categoryMovies', {
                    category: categoryLabel(
                      t,
                      activeCategory,
                      CATEGORIES.find(
                        (item) =>
                          item.id ===
                          activeCategory
                      )?.label ?? activeCategory
                    ),
                  })
            }
            onSeeAll={() =>
              router.push('/explore')
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.horizontalList
            }
          >
            {visibleMovies.map(
              (movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  rank={
                    activeCategory === 'all'
                      ? index + 1
                      : undefined
                  }
                  onPress={() =>
                    router.push(
                      `/movie/${movie.id}`
                    )
                  }
                />
              )
            )}
          </ScrollView>
        </View>

        {/* CULTURE PROMOTION */}

        <Pressable
          onPress={() =>
            router.push('/culture')
          }
          style={({ pressed }) => [
            styles.cultureCard,
            pressed && {
              opacity: 0.8,
            },
          ]}
        >
          <LinearGradient
            colors={[
              '#1B1205',
              '#100B06',
              '#090909',
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.cultureGlow} />

          <View style={styles.cultureContent}>
            <View style={styles.cultureIcon}>
              <Feather
                name="globe"
                size={23}
                color={THEME.gold}
              />
            </View>

            <View style={styles.cultureTexts}>
              <Text
                style={styles.cultureEyebrow}
              >
                {t('home.discoverCameroon')}
              </Text>

              <Text style={styles.cultureTitle}>
                {t('home.moreThanMovies')}
              </Text>

              <Text
                style={styles.cultureDescription}
              >
                {t('home.cultureDescription')}
              </Text>
            </View>

            <View style={styles.arrowButton}>
              <Feather
                name="arrow-up-right"
                size={19}
                color="#080808"
              />
            </View>
          </View>
        </Pressable>

        {/* NEW RELEASES */}

        <View style={styles.section}>
          <SectionTitle
            title={t('home.newReleases')}
            onSeeAll={() =>
              router.push('/explore')
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.horizontalList
            }
          >
            {NEW_RELEASES.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPress={() =>
                  router.push(
                    `/movie/${movie.id}`
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* EDITORIAL DOCUMENTARIES */}

        <View style={styles.section}>
          <SectionTitle title={t('home.documentaries')} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {DOCUMENTARIES.map((documentary) => (
              <DocumentaryCard
                key={documentary.id}
                documentary={documentary}
                onPress={() =>
                  router.push(
                    `/discover/documentary/${documentary.id}` as never
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* HERITAGE CARD */}

        <View style={styles.heritage}>
          <BlurView
            intensity={45}
            tint="dark"
            experimentalBlurMethod={
              Platform.OS === 'android'
                ? 'dimezisBlurView'
                : undefined
            }
            style={
              StyleSheet.absoluteFill
            }
          />

          <View style={styles.heritageTint} />

          <View style={styles.heritageIcon}>
            <Feather
              name="award"
              size={24}
              color={THEME.gold}
            />
          </View>

          <View style={styles.heritageContent}>
            <Text style={styles.heritageTitle}>
              {t('home.productionSpotlightTitle')}
            </Text>

            <Text
              style={styles.heritageSubtitle}
            >
              {t('home.productionSpotlightSubtitle')}
            </Text>
          </View>

          <Feather
            name="chevron-right"
            size={20}
            color={THEME.gold}
          />
        </View>

        {/* SERIES */}

        {SERIES_EPISODES.length > 0 && (
          <View style={styles.section}>
            <SectionTitle
              title={t('home.series')}
              onSeeAll={() =>
                router.push('/explore')
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {SERIES_EPISODES.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  size="lg"
                  onPress={() =>
                    router.push(`/movie/${movie.id}`)
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* SHORT FILMS */}

        {SHORTS.length > 0 && (
          <View style={styles.section}>
            <SectionTitle
              title={t('home.shortFilms')}
              onSeeAll={() =>
                router.push('/explore')
              }
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {SHORTS.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  size="sm"
                  onPress={() =>
                    router.push(`/movie/${movie.id}`)
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* DISCOVER MORE */}

        <View style={styles.section}>
          <SectionTitle
            title={t('home.hiddenGems')}
            onSeeAll={() =>
              router.push('/explore')
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.horizontalList
            }
          >
            {MOVIES.slice(6, 12).map(
              (movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  size="sm"
                  onPress={() =>
                    router.push(
                      `/movie/${movie.id}`
                    )
                  }
                />
              )
            )}
          </ScrollView>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>
            MBOA FLIX
          </Text>

          <Text style={styles.footerText}>
            {t('home.footer')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: '#050505',
  },

  scrollContent: {
    paddingBottom: 135,
  },

  header: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'center',

    paddingHorizontal: 18,

    paddingBottom: 18,
  },

  logo: {
    color: '#FFFFFF',

    fontSize: 25,
    fontWeight: '800',

    letterSpacing: 1.5,
  },

  logoAccent: {
    color: THEME.gold,
  },

  tagline: {
    color:
      'rgba(255,255,255,0.42)',

    fontSize: 11,

    marginTop: 3,

    letterSpacing: 0.4,
  },

  headerActions: {
    flexDirection: 'row',

    gap: 9,
  },

  glassIconButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.12)',
  },

  glassIconTint: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(255,255,255,0.045)',
  },

  categories: {
    marginTop: 20,
  },

  categoriesContent: {
    paddingHorizontal: 18,

    paddingRight: 9,
  },

  section: {
    marginTop: 32,
  },

  horizontalList: {
    paddingHorizontal: 18,

    paddingRight: 5,
  },

  cultureCard: {
    marginHorizontal: 18,

    marginTop: 34,

    minHeight: 170,

    borderRadius: 28,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      'rgba(212,175,55,0.18)',
  },

  cultureGlow: {
    position: 'absolute',

    width: 180,
    height: 180,

    borderRadius: 90,

    right: -50,
    top: -70,

    backgroundColor:
      'rgba(212,175,55,0.10)',
  },

  cultureContent: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    padding: 20,

    gap: 15,
  },

  cultureIcon: {
    width: 48,
    height: 48,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(212,175,55,0.10)',

    borderWidth: 1,

    borderColor:
      'rgba(212,175,55,0.20)',
  },

  cultureTexts: {
    flex: 1,
  },

  cultureEyebrow: {
    color: THEME.gold,

    fontSize: 9,
    fontWeight: '800',

    letterSpacing: 1.5,
  },

  cultureTitle: {
    color: '#FFFFFF',

    fontSize: 20,
    fontWeight: '800',

    marginTop: 5,
  },

  cultureDescription: {
    color:
      'rgba(255,255,255,0.56)',

    fontSize: 12,
    lineHeight: 18,

    marginTop: 7,
  },

  arrowButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: THEME.gold,

    alignItems: 'center',
    justifyContent: 'center',
  },

  heritage: {
    marginHorizontal: 18,

    marginTop: 32,

    minHeight: 92,

    borderRadius: 24,

    overflow: 'hidden',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 17,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.10)',
  },

  heritageTint: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(15,15,15,0.64)',
  },

  heritageIcon: {
    width: 46,
    height: 46,

    borderRadius: 17,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor:
      'rgba(212,175,55,0.09)',

    borderWidth: 1,

    borderColor:
      'rgba(212,175,55,0.16)',
  },

  heritageContent: {
    flex: 1,

    marginLeft: 13,
  },

  heritageTitle: {
    color: '#FFFFFF',

    fontSize: 15,
    fontWeight: '700',
  },

  heritageSubtitle: {
    color:
      'rgba(255,255,255,0.45)',

    fontSize: 11,

    marginTop: 4,
  },

  footer: {
    alignItems: 'center',

    paddingTop: 55,
    paddingBottom: 20,
  },

  footerLine: {
    width: 30,
    height: 2,

    borderRadius: 2,

    backgroundColor: THEME.gold,

    marginBottom: 16,
  },

  footerBrand: {
    color: THEME.gold,

    fontSize: 13,
    fontWeight: '800',

    letterSpacing: 3,
  },

  footerText: {
    color:
      'rgba(255,255,255,0.28)',

    marginTop: 8,

    fontSize: 11,
  },
});
