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
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionTitle } from '@/components/SectionTitle';
import { CULTURE_ITEMS, FOOD_ITEMS } from '@/data/culture';
import { THEME } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FeatherIconName = keyof typeof Feather.glyphMap;

const ICON_MAP: Record<string, FeatherIconName> = {
  music: 'music',
  activity: 'activity',
  star: 'star',
  image: 'image',
  book: 'book',
};

export default function CultureScreen() {
  const musicItems = CULTURE_ITEMS.filter((c) => c.category === 'music');
  const danceItems = CULTURE_ITEMS.filter((c) => c.category === 'dance');
  const traditionItems = CULTURE_ITEMS.filter((c) => c.category === 'tradition');
  const artItems = CULTURE_ITEMS.filter((c) => c.category === 'art');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>CAMEROON</Text>
          <Text style={styles.headerTitle}>Culture & Heritage</Text>
          <Text style={styles.headerSub}>
            Explore the rich traditions, rhythms, and flavors of Cameroon — Africa in miniature.
          </Text>
        </View>

        {/* Culture Hero */}
        <View style={[styles.cultureHero, { backgroundColor: THEME.card }]}>
          <LinearGradient
            colors={['#1A0800', '#2E1500', '#0A0A0A']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroStat}>10</Text>
            <Text style={styles.heroStatLabel}>Regions</Text>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroStat}>280+</Text>
            <Text style={styles.heroStatLabel}>Languages</Text>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroStat}>500+</Text>
            <Text style={styles.heroStatLabel}>Ethnic Groups</Text>
          </View>
        </View>

        {/* Music Section */}
        <View style={styles.section}>
          <SectionTitle title="Music & Rhythms" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {musicItems.map((item) => (
              <CultureCard key={item.id} item={item} />
            ))}
            {danceItems.map((item) => (
              <CultureCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Food Section */}
        <View style={styles.section}>
          <SectionTitle title="Cameroonian Cuisine" />
          <View style={styles.foodGrid}>
            {FOOD_ITEMS.map((food) => (
              <Pressable
                key={food.id}
                style={({ pressed }) => [
                  styles.foodCard,
                  { backgroundColor: food.color },
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.75)']}
                  style={styles.foodGradient}
                />
                <View style={styles.foodContent}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodRegion}>{food.region}</Text>
                  <Text style={styles.foodDesc} numberOfLines={2}>
                    {food.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Traditions Section */}
        <View style={styles.section}>
          <SectionTitle title="Traditions & Festivals" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {traditionItems.map((item) => (
              <CultureCard key={item.id} item={item} />
            ))}
            {artItems.map((item) => (
              <CultureCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Quote */}
        <View style={styles.quoteBlock}>
          <Text style={styles.quoteText}>
            "Cameroon is Africa in miniature — every landscape, every language, every flavor of the continent."
          </Text>
          <Text style={styles.quoteAuthor}>— African Proverb</Text>
        </View>

        {Platform.OS === 'web' && <View style={{ height: 34 }} />}
      </ScrollView>
    </SafeAreaView>
  );
}

function CultureCard({ item }: { item: (typeof CULTURE_ITEMS)[0] }) {
  const iconName: FeatherIconName = ICON_MAP[item.icon] ?? 'star';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cultureCard,
        { backgroundColor: item.color },
        pressed && { opacity: 0.85 },
      ]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.72)']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cultureCardIcon}>
        <Feather name={iconName} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.cultureCardBottom}>
        <Text style={styles.cultureCardTitle}>{item.title}</Text>
        <Text style={styles.cultureCardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 77 : 20,
    paddingBottom: 20,
  },
  headerEyebrow: {
    color: THEME.gold,
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 3,
    marginBottom: 6,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  headerSub: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 21,
  },
  cultureHero: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroStat: {
    color: THEME.gold,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  heroStatLabel: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    paddingRight: 20,
  },
  cultureCard: {
    width: 200,
    height: 140,
    borderRadius: 14,
    marginRight: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 14,
  },
  cultureCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cultureCardBottom: {},
  cultureCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  cultureCardDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 10,
  },
  foodCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  foodGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  foodContent: {
    padding: 12,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  foodRegion: {
    color: THEME.gold,
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  foodDesc: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
  },
  quoteBlock: {
    marginHorizontal: 20,
    padding: 24,
    borderLeftWidth: 3,
    borderLeftColor: THEME.gold,
    backgroundColor: THEME.card,
    borderRadius: 12,
  },
  quoteText: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 10,
  },
  quoteAuthor: {
    color: THEME.gold,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});
