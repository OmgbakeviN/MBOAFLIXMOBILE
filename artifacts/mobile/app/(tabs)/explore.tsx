import React, {
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Feather from '@/components/FeatherCompat';

import { BlurView } from 'expo-blur';

import { useRouter } from 'expo-router';

import * as Haptics from 'expo-haptics';

import { CategoryButton } from '@/components/CategoryButton';

import { MovieCard } from '@/components/MovieCard';

import { MOVIES } from '@/data/movies';

import { CATEGORIES } from '@/data/categories';

import { THEME } from '@/constants/theme';

type SortMode =
  | 'relevance'
  | 'rating'
  | 'newest';

export default function ExploreScreen() {
  const router = useRouter();

  const { width } =
    useWindowDimensions();

  const [search, setSearch] =
    useState('');

  const [
    activeCategory,
    setActiveCategory,
  ] = useState('all');

  const [sortMode, setSortMode] =
    useState<SortMode>('relevance');

  const numColumns =
    width >= 900
      ? 5
      : width >= 650
        ? 4
        : 2;

  const filteredMovies =
    useMemo(() => {
      let result = [...MOVIES];

      if (
        activeCategory !== 'all'
      ) {
        result = result.filter(
          (movie) =>
            movie.genre.toLowerCase() ===
              activeCategory.toLowerCase() ||
            movie.tags.some(
              (tag) =>
                tag.toLowerCase() ===
                activeCategory.toLowerCase()
            )
        );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result = result.filter(
          (movie) => {
            const searchableText = [
              movie.title,
              movie.genre,
              movie.director ?? '',
              movie.description,
              ...movie.tags,
            ]
              .join(' ')
              .toLowerCase();

            return searchableText.includes(
              query
            );
          }
        );
      }

      if (sortMode === 'rating') {
        result.sort(
          (a, b) =>
            b.rating - a.rating
        );
      }

      if (sortMode === 'newest') {
        result.sort(
          (a, b) =>
            b.year - a.year
        );
      }

      return result;
    }, [
      search,
      activeCategory,
      sortMode,
    ]);

  const cycleSortMode = () => {
    Haptics.selectionAsync();

    setSortMode((current) => {
      if (
        current === 'relevance'
      ) {
        return 'rating';
      }

      if (
        current === 'rating'
      ) {
        return 'newest';
      }

      return 'relevance';
    });
  };

  const sortLabel =
    sortMode === 'rating'
      ? 'Top rated'
      : sortMode === 'newest'
        ? 'Newest'
        : 'Recommended';

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <FlatList
        key={`grid-${numColumns}`}
        data={filteredMovies}
        numColumns={numColumns}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContent
        }
        columnWrapperStyle={
          numColumns > 1
            ? styles.row
            : undefined
        }
        ListHeaderComponent={
          <>
            {/* HEADER */}

            <View style={styles.header}>
              <View>
                <Text
                  style={
                    styles.eyebrow
                  }
                >
                  MBOA FLIX
                </Text>

                <Text
                  style={
                    styles.title
                  }
                >
                  Explore
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  Discover stories from
                  Cameroon
                </Text>
              </View>

              <View
                style={
                  styles.headerIcon
                }
              >
                <Feather
                  name="compass"
                  size={21}
                  color={
                    THEME.gold
                  }
                />
              </View>
            </View>

            {/* SEARCH */}

            <View
              style={
                styles.searchWrapper
              }
            >
              <BlurView
                intensity={65}
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
                  styles.searchTint
                }
              />

              <Feather
                name="search"
                size={19}
                color="rgba(255,255,255,0.48)"
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search movies, genres, directors..."
                placeholderTextColor="rgba(255,255,255,0.30)"
                returnKeyType="search"
                autoCapitalize="none"
                style={
                  styles.searchInput
                }
              />

              {!!search && (
                <Pressable
                  onPress={() =>
                    setSearch('')
                  }
                  hitSlop={10}
                >
                  <View
                    style={
                      styles.clearButton
                    }
                  >
                    <Feather
                      name="x"
                      size={15}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>
              )}
            </View>

            {/* CATEGORIES */}

            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) =>
                item.id
              }
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.categories
              }
              renderItem={({
                item,
              }) => (
                <CategoryButton
                  label={
                    item.label
                  }
                  active={
                    activeCategory ===
                    item.id
                  }
                  onPress={() =>
                    setActiveCategory(
                      item.id
                    )
                  }
                />
              )}
            />

            {/* RESULT TOOLBAR */}

            <View
              style={
                styles.resultsHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.resultTitle
                  }
                >
                  {search
                    ? `Results for "${search}"`
                    : 'Browse movies'}
                </Text>

                <Text
                  style={
                    styles.resultCount
                  }
                >
                  {
                    filteredMovies.length
                  }{' '}
                  {filteredMovies.length ===
                  1
                    ? 'movie'
                    : 'movies'}
                </Text>
              </View>

              <Pressable
                onPress={
                  cycleSortMode
                }
                style={
                  styles.sortButton
                }
              >
                <Feather
                  name="sliders"
                  size={14}
                  color={
                    THEME.gold
                  }
                />

                <Text
                  style={
                    styles.sortText
                  }
                >
                  {sortLabel}
                </Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={styles.gridItem}
          >
            <MovieCard
              movie={item}
              size="sm"
              onPress={() =>
                router.push(
                  `/movie/${item.id}`
                )
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <View
            style={
              styles.emptyState
            }
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Feather
                name="search"
                size={28}
                color={
                  THEME.gold
                }
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Nothing found
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Try another title,
              director or category.
            </Text>

            <Pressable
              onPress={() => {
                setSearch('');
                setActiveCategory(
                  'all'
                );
                setSortMode(
                  'relevance'
                );
              }}
              style={
                styles.resetButton
              }
            >
              <Text
                style={
                  styles.resetText
                }
              >
                Reset filters
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safe: {
      flex: 1,

      backgroundColor:
        THEME.background,
    },

    listContent: {
      paddingBottom: 130,

      paddingHorizontal: 14,
    },

    header: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 6,

      paddingTop:
        Platform.OS === 'web'
          ? 24
          : 6,

      paddingBottom: 20,
    },

    eyebrow: {
      color: THEME.gold,

      fontSize: 9,

      fontWeight: '800',

      letterSpacing: 2,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 31,

      fontWeight: '800',

      marginTop: 4,
    },

    subtitle: {
      color:
        'rgba(255,255,255,0.42)',

      fontSize: 12,

      marginTop: 4,
    },

    headerIcon: {
      width: 46,

      height: 46,

      borderRadius: 18,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(216,178,92,0.08)',

      borderWidth: 1,

      borderColor:
        'rgba(216,178,92,0.18)',
    },

    searchWrapper: {
      height: 58,

      borderRadius: 20,

      overflow: 'hidden',

      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 16,

      gap: 11,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.11)',

      marginHorizontal: 6,
    },

    searchTint: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        'rgba(15,15,15,0.63)',
    },

    searchInput: {
      flex: 1,

      color: '#FFFFFF',

      fontSize: 14,

      height: '100%',
    },

    clearButton: {
      width: 28,

      height: 28,

      borderRadius: 14,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(255,255,255,0.10)',
    },

    categories: {
      paddingHorizontal: 6,

      paddingTop: 18,

      paddingBottom: 20,
    },

    resultsHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',

      paddingHorizontal: 6,

      marginBottom: 18,
    },

    resultTitle: {
      color: '#FFFFFF',

      fontSize: 18,

      fontWeight: '700',
    },

    resultCount: {
      color:
        'rgba(255,255,255,0.35)',

      fontSize: 11,

      marginTop: 3,
    },

    sortButton: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 6,

      paddingHorizontal: 11,

      paddingVertical: 8,

      borderRadius: 14,

      backgroundColor:
        'rgba(255,255,255,0.04)',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.08)',
    },

    sortText: {
      color:
        'rgba(255,255,255,0.70)',

      fontSize: 10,

      fontWeight: '600',
    },

    row: {
      justifyContent:
        'space-around',
    },

    gridItem: {
      flex: 1,

      alignItems: 'center',

      marginBottom: 18,
    },

    emptyState: {
      alignItems: 'center',

      paddingVertical: 70,

      paddingHorizontal: 30,
    },

    emptyIcon: {
      width: 68,

      height: 68,

      borderRadius: 25,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(216,178,92,0.08)',

      borderWidth: 1,

      borderColor:
        'rgba(216,178,92,0.15)',
    },

    emptyTitle: {
      color: '#FFFFFF',

      fontSize: 19,

      fontWeight: '700',

      marginTop: 18,
    },

    emptyText: {
      color:
        'rgba(255,255,255,0.42)',

      textAlign: 'center',

      fontSize: 13,

      lineHeight: 20,

      marginTop: 7,
    },

    resetButton: {
      marginTop: 18,

      paddingHorizontal: 18,

      paddingVertical: 11,

      borderRadius: 16,

      backgroundColor:
        THEME.gold,
    },

    resetText: {
      color: '#050505',

      fontSize: 12,

      fontWeight: '700',
    },
  });