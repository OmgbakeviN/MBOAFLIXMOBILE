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
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import { cultureCategoryLabel, cultureDescription, cultureTitle, localizedText } from '@/utils/localizedContent';
import { CULTURE_ITEMS } from '@/data/culture';
import { CultureItem } from '@/types';

type CultureFilter =
  | 'all'
  | CultureItem['category'];

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
  {
    id: 'festival',
    label: 'Festivals',
  },
  {
    id: 'heritage',
    label: 'Heritage',
  },
  {
    id: 'historical_place',
    label: 'Historical places',
  },
];

export default function CultureScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<CultureFilter>(
      'all'
    );

  const items = useMemo(() => {
    if (activeFilter === 'all') {
      return CULTURE_ITEMS;
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
            {t('culture.eyebrow')}
          </Text>

          <Text style={styles.title}>
            {t('culture.title')}
          </Text>

          <Text style={styles.subtitle}>
            {t('culture.subtitle')}
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
              {t('culture.cuisineEyebrow')}
            </Text>

            <Text style={styles.foodTitle}>
              {t('culture.tasteCameroon')}
            </Text>

            <Text style={styles.foodDescription}>
              {t('culture.cuisineDescription')}
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
            {t('culture.culturalStories')}
          </Text>

          <Text style={styles.sectionCount}>
            {t('culture.stories', { count: items.length })}
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
                  {t(`culture.filters.${filter.id === 'tradition' ? 'traditions' : filter.id}`)}
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
                onPress={() => {
                  Haptics.impactAsync(
                    Haptics
                      .ImpactFeedbackStyle
                      .Light
                  );

                  router.push(
                    `/discover/culture/${item.id}` as never
                  );
                }}
                style={({ pressed }) => [
                  styles.cultureCard,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <Image
                  source={item.image}
                  contentFit="cover"
                  transition={180}
                  style={StyleSheet.absoluteFill}
                />

                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.18)',
                    'rgba(8,8,8,0.78)',
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
                  {cultureCategoryLabel(t, item.category).toUpperCase()}
                </Text>

                {item.region && (
                  <View style={styles.cardRegionRow}>
                    <Feather name="map-pin" size={11} color={THEME.goldLight} />
                    <Text style={styles.cardRegion}>{localizedText(item.region)}</Text>
                  </View>
                )}

                <Text style={styles.cardTitle}>
                  {cultureTitle(t, item)}
                </Text>

                <Text
                  style={
                    styles.cardDescription
                  }
                  numberOfLines={3}
                >
                  {cultureDescription(t, item)}
                </Text>

                <View style={styles.discoverRow}>
                  <View style={styles.discoverAction}>
                    <Text style={styles.discoverText}>{t('culture.discover')}</Text>
                    <Feather name="arrow-up-right" size={15} color={THEME.gold} />
                  </View>

                  <Text style={styles.photoCredit} numberOfLines={1}>
                    {t('culture.photoCredit', {
                      author: item.imageAttribution.author ?? t('culture.unknownAuthor'),
                      license: item.imageAttribution.license,
                    })}
                  </Text>
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
    minHeight: 285,
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

  cardRegionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  cardRegion: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 10,
    flex: 1,
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
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
  },

  discoverAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  discoverText: {
    color: THEME.gold,
    fontSize: 11,
    fontWeight: '600',
  },

  photoCredit: {
    color: 'rgba(255,255,255,0.36)',
    fontSize: 8,
    flex: 1,
    textAlign: 'right',
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
