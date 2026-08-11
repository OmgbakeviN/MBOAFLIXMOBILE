import React, {
  useMemo,
  useState,
} from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Feather from '@/components/FeatherCompat';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { CULTURE_ITEMS } from '@/data/culture';
import { CultureItem } from '@/types';

type CultureFilter =
  | 'all'
  | Exclude<
      CultureItem['category'],
      'food'
    >;

type FeatherIconName =
  keyof typeof Feather.glyphMap;

const FILTERS: {
  id: CultureFilter;
  label: string;
}[] = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'music',
    label: 'Music',
  },
  {
    id: 'dance',
    label: 'Dance',
  },
  {
    id: 'tradition',
    label: 'Traditions',
  },
  {
    id: 'art',
    label: 'Art',
  },
];

export default function CultureScreen() {
  const router = useRouter();

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<CultureFilter>(
      'all'
    );

  const items = useMemo(() => {
    if (activeFilter === 'all') {
      return CULTURE_ITEMS.filter(
        (item) =>
          item.category !== 'food'
      );
    }

    return CULTURE_ITEMS.filter(
      (item) =>
        item.category ===
        activeFilter
    );
  }, [activeFilter]);

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            DISCOVER CAMEROON
          </Text>

          <Text style={styles.title}>
            Culture
          </Text>

          <Text style={styles.subtitle}>
            Explore music, dance, traditions,
            art and the stories that connect
            generations across Cameroon.
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(
              Haptics
                .ImpactFeedbackStyle
                .Light
            );

            router.push('/food');
          }}
          style={({ pressed }) => [
            styles.foodGateway,
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={[
              '#2B1705',
              '#151008',
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
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.foodGlow} />

          <View style={styles.foodIcon}>
            <Feather
              name="coffee"
              size={25}
              color={THEME.gold}
            />
          </View>

          <View style={styles.foodTextBlock}>
            <Text style={styles.foodEyebrow}>
              CAMEROONIAN CUISINE
            </Text>

            <Text style={styles.foodTitle}>
              Taste Cameroon
            </Text>

            <Text style={styles.foodDescription}>
              Ndolé, Eru, Koki, Kondré and
              more regional dishes.
            </Text>
          </View>

          <View style={styles.foodArrow}>
            <Feather
              name="arrow-up-right"
              size={18}
              color="#050505"
            />
          </View>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Cultural Stories
          </Text>

          <Text style={styles.sectionCount}>
            {items.length} stories
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map(
            (filter) => (
              <Pressable
                key={filter.id}
                onPress={() => {
                  Haptics.selectionAsync();

                  setActiveFilter(
                    filter.id
                  );
                }}
                style={[
                  styles.filterButton,
                  activeFilter ===
                    filter.id &&
                    styles.filterActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter ===
                      filter.id &&
                      styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            )
          )}
        </ScrollView>

        <View style={styles.list}>
          {items.map((item) => {
            const icon =
              (
                item.icon in
                Feather.glyphMap
                  ? item.icon
                  : 'star'
              ) as FeatherIconName;

            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  Haptics
                    .impactAsync(
                      Haptics
                        .ImpactFeedbackStyle
                        .Light
                    )
                }
                style={({ pressed }) => [
                  styles.cultureCard,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={[
                    item.color,
                    '#15100B',
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

                <View
                  style={[
                    styles.cardGlow,
                    {
                      backgroundColor:
                        item.color,
                    },
                  ]}
                />

                <View style={styles.cardIcon}>
                  <Feather
                    name={icon}
                    size={23}
                    color="#FFFFFF"
                  />
                </View>

                <Text
                  style={
                    styles.cardCategory
                  }
                >
                  {item.category.toUpperCase()}
                </Text>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                  numberOfLines={3}
                >
                  {item.description}
                </Text>

                <View style={styles.discoverRow}>
                  <Text style={styles.discoverText}>
                    Discover
                  </Text>

                  <Feather
                    name="arrow-up-right"
                    size={15}
                    color={THEME.gold}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },

  scrollContent: {
    paddingBottom: 135,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
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
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.44)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 370,
  },

  foodGateway: {
    minHeight: 180,
    marginHorizontal: 18,
    borderRadius: 28,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 19,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.18)',
  },

  foodGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -65,
    top: -70,
    backgroundColor: 'rgba(216,178,92,0.12)',
  },

  foodIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.18)',
  },

  foodTextBlock: {
    flex: 1,
  },

  foodEyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  foodTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },

  foodDescription: {
    color: 'rgba(255,255,255,0.50)',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  foodArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.gold,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 30,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  sectionCount: {
    color: 'rgba(255,255,255,0.32)',
    fontSize: 10,
  },

  filters: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 9,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  filterActive: {
    backgroundColor: THEME.gold,
    borderColor: THEME.gold,
  },

  filterText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#050505',
    fontWeight: '800',
  },

  list: {
    paddingHorizontal: 18,
    gap: 14,
  },

  cultureCard: {
    minHeight: 205,
    borderRadius: 27,
    overflow: 'hidden',
    padding: 19,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },

  cardGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -40,
    top: -50,
    opacity: 0.14,
  },

  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    marginBottom: 18,
  },

  cardCategory: {
    color: THEME.goldLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 5,
  },

  cardDescription: {
    color: 'rgba(255,255,255,0.60)',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  discoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 15,
  },

  discoverText: {
    color: THEME.gold,
    fontSize: 11,
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
