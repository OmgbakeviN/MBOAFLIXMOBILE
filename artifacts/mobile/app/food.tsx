import React, { useMemo, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StatusBar,
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
import { FOOD_ITEMS } from '@/data/culture';
import { FoodItem } from '@/types';

export default function FoodScreen() {
  const router = useRouter();

  const [selectedId, setSelectedId] =
    useState(FOOD_ITEMS[0]?.id ?? '');

  const selectedFood = useMemo(
    () =>
      FOOD_ITEMS.find(
        (item) =>
          item.id === selectedId
      ) ?? FOOD_ITEMS[0],
    [selectedId]
  );

  if (!selectedFood) {
    return null;
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <StatusBar
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.navigation}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather
              name="arrow-left"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.brand}>
            MBOA
            <Text style={styles.brandGold}>
              {' '}FLIX
            </Text>
          </Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            CAMEROONIAN CUISINE
          </Text>

          <Text style={styles.title}>
            Taste Cameroon
          </Text>

          <Text style={styles.subtitle}>
            Discover iconic dishes from
            different regions of Cameroon.
          </Text>
        </View>

        <View
          style={[
            styles.hero,
            {
              backgroundColor:
                selectedFood.color,
            },
          ]}
        >
          <LinearGradient
            colors={[
              selectedFood.color,
              '#161009',
              '#060606',
            ]}
            style={
              StyleSheet.absoluteFill
            }
          />

          <View style={styles.heroGlow} />

          <View style={styles.heroIcon}>
            <Feather
              name="coffee"
              size={34}
              color={THEME.goldLight}
            />
          </View>

          <Text style={styles.heroEyebrow}>
            FEATURED DISH
          </Text>

          <Text style={styles.heroTitle}>
            {selectedFood.name}
          </Text>

          <View style={styles.regionRow}>
            <Feather
              name="map-pin"
              size={12}
              color={THEME.gold}
            />

            <Text style={styles.regionText}>
              {selectedFood.region}
            </Text>
          </View>

          <Text style={styles.description}>
            {selectedFood.description}
          </Text>

          <Pressable
            onPress={() =>
              Haptics
                .impactAsync(
                  Haptics
                    .ImpactFeedbackStyle
                    .Light
                )
            }
            style={styles.recipeButton}
          >
            <Feather
              name="book-open"
              size={15}
              color="#050505"
            />

            <Text style={styles.recipeText}>
              Recipe details coming soon
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Dishes
          </Text>

          <Text style={styles.sectionCount}>
            {FOOD_ITEMS.length} dishes
          </Text>
        </View>

        <View style={styles.grid}>
          {FOOD_ITEMS.map(
            (food) => (
              <FoodCard
                key={food.id}
                food={food}
                selected={
                  selectedFood.id ===
                  food.id
                }
                onPress={() => {
                  Haptics.selectionAsync();

                  setSelectedId(
                    food.id
                  );
                }}
              />
            )
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>
            MBOA FLIX
          </Text>

          <Text style={styles.footerText}>
            Our culture. Our flavors.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FoodCard({
  food,
  selected,
  onPress,
}: {
  food: FoodItem;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.foodCard,
        selected &&
          styles.foodCardSelected,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[
          food.color,
          '#13100A',
          '#080808',
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      <View style={styles.foodOverlay} />

      <View style={styles.foodIconSmall}>
        <Feather
          name="coffee"
          size={18}
          color={THEME.goldLight}
        />
      </View>

      <View style={styles.foodContent}>
        <Text
          style={styles.foodName}
          numberOfLines={1}
        >
          {food.name}
        </Text>

        <View style={styles.foodRegionRow}>
          <Feather
            name="map-pin"
            size={10}
            color="rgba(255,255,255,0.48)"
          />

          <Text
            style={styles.foodRegion}
            numberOfLines={1}
          >
            {food.region}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },

  scrollContent: {
    paddingBottom: 45,
  },

  navigation: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  brand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  brandGold: {
    color: THEME.gold,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },

  eyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.43)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  hero: {
    minHeight: 335,
    marginHorizontal: 18,
    borderRadius: 30,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: -100,
    right: -80,
    backgroundColor: 'rgba(216,178,92,0.10)',
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 20,
  },

  heroEyebrow: {
    color: THEME.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5,
  },

  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },

  regionText: {
    color: 'rgba(255,255,255,0.53)',
    fontSize: 11,
  },

  description: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 13,
  },

  recipeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: THEME.gold,
  },

  recipeText: {
    color: '#050505',
    fontSize: 11,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 30,
    marginBottom: 15,
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

  grid: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  foodCard: {
    width: '48%',
    height: 165,
    borderRadius: 23,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  foodCardSelected: {
    borderColor: 'rgba(216,178,92,0.65)',
    borderWidth: 1.5,
  },

  foodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },

  foodIconSmall: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.42)',
  },

  foodContent: {
    position: 'absolute',
    left: 13,
    right: 13,
    bottom: 13,
  },

  foodName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  foodRegionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  foodRegion: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 9,
    flex: 1,
  },

  pressed: {
    opacity: 0.78,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  footer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },

  footerLine: {
    width: 30,
    height: 2,
    borderRadius: 2,
    backgroundColor: THEME.gold,
    marginBottom: 15,
  },

  footerBrand: {
    color: THEME.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
  },

  footerText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 10,
    marginTop: 7,
  },
});
