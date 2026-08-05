import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoryButton } from '@/components/CategoryButton';
import { MovieCard } from '@/components/MovieCard';
import { MOVIES } from '@/data/movies';
import { CATEGORIES } from '@/data/categories';
import { THEME } from '@/constants/theme';

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    let result = MOVIES;
    if (activeCategory !== 'all') {
      result = result.filter(
        (m) => m.genre.toLowerCase() === activeCategory.toLowerCase()
          || m.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase())
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          (m.director ?? '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory]);

  const numColumns = 3;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSub}>Discover Cameroonian Cinema</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={THEME.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search films, directors…"
            placeholderTextColor={THEME.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <Feather name="x" size={16} color={THEME.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => (
          <CategoryButton
            key={cat.id}
            label={cat.label}
            active={activeCategory === cat.id}
            onPress={() => setActiveCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length === 1 ? 'film' : 'films'}
        </Text>
      </View>

      {/* Grid */}
      {filtered.length > 0 ? (
        <FlatList
          key={`grid-${numColumns}`}
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <MovieCard
                movie={item}
                size="sm"
                onPress={() => router.push(`/movie/${item.id}`)}
              />
            </View>
          )}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="film" size={48} color={THEME.textMuted} />
          <Text style={styles.emptyTitle}>No films found</Text>
          <Text style={styles.emptyText}>Try a different search or category</Text>
        </View>
      )}

      {/* Web bottom inset */}
      {Platform.OS === 'web' && <View style={{ height: 34 }} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 67 : 0,
    paddingBottom: 6,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  headerSub: {
    color: THEME.textMuted,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  searchInput: {
    flex: 1,
    color: THEME.text,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  categoriesScroll: {
    marginTop: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  resultsRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  gridContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    color: THEME.text,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyText: {
    color: THEME.textMuted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});
