import React from 'react';

import {
  Linking,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import Feather from '@/components/FeatherCompat';
import { THEME } from '@/constants/theme';
import {
  CULTURE_ITEMS,
  FOOD_ITEMS,
} from '@/data/culture';
import { DOCUMENTARIES } from '@/data/documentaries';
import {
  ContentSource,
  CultureItem,
  EditorialDocumentary,
  FoodItem,
  ImageAttribution,
} from '@/types';
import {
  cultureCategoryLabel,
  cultureDescription,
  cultureTitle,
  documentaryDescription,
  documentaryTitle,
  foodDescription,
  foodIngredients,
  foodRegion,
  localizedText,
} from '@/utils/localizedContent';

type DetailKind =
  | 'culture'
  | 'food'
  | 'documentary';

export default function DiscoveryDetailScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    kind?: string | string[];
    id?: string | string[];
  }>();

  const kindRaw = Array.isArray(params.kind)
    ? params.kind[0]
    : params.kind;

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const kind = kindRaw as
    | DetailKind
    | undefined;

  if (!kind || !id) {
    return <NotFound onBack={() => router.back()} />;
  }

  if (kind === 'culture') {
    const item = CULTURE_ITEMS.find(
      (entry) => entry.id === id
    );

    return item ? (
      <CultureDetail item={item} />
    ) : (
      <NotFound onBack={() => router.back()} />
    );
  }

  if (kind === 'food') {
    const food = FOOD_ITEMS.find(
      (entry) => entry.id === id
    );

    return food ? (
      <FoodDetail food={food} />
    ) : (
      <NotFound onBack={() => router.back()} />
    );
  }

  if (kind === 'documentary') {
    const documentary = DOCUMENTARIES.find(
      (entry) => entry.id === id
    );

    return documentary ? (
      <DocumentaryDetail documentary={documentary} />
    ) : (
      <NotFound onBack={() => router.back()} />
    );
  }

  return <NotFound onBack={() => router.back()} />;
}

function CultureDetail({ item }: { item: CultureItem }) {
  const router = useRouter();
  const { t } = useTranslation();

  const related = CULTURE_ITEMS.filter(
    (entry) =>
      entry.id !== item.id &&
      entry.category === item.category
  ).slice(0, 3);

  return (
    <DetailShell
      image={item.image}
      eyebrow={cultureCategoryLabel(t, item.category).toUpperCase()}
      title={cultureTitle(t, item)}
      region={item.region ? localizedText(item.region) : undefined}
      onBack={() => router.back()}
    >
      <InfoSection title={t('details.about')}>
        <Text style={styles.bodyText}>
          {cultureDescription(t, item)}
        </Text>
      </InfoSection>

      <MetaGrid
        category={cultureCategoryLabel(t, item.category)}
        region={item.region ? localizedText(item.region) : undefined}
      />

      <SourcesBlock
        sources={item.sources}
        imageAttribution={item.imageAttribution}
      />

      {related.length > 0 && (
        <RelatedSection title={t('details.related')}>
          {related.map((entry) => (
            <RelatedCard
              key={entry.id}
              image={entry.image}
              title={cultureTitle(t, entry)}
              subtitle={cultureCategoryLabel(t, entry.category)}
              onPress={() =>
                router.replace(
                  `/discover/culture/${entry.id}` as never
                )
              }
            />
          ))}
        </RelatedSection>
      )}
    </DetailShell>
  );
}

function FoodDetail({ food }: { food: FoodItem }) {
  const router = useRouter();
  const { t } = useTranslation();

  const related = FOOD_ITEMS.filter(
    (entry) =>
      entry.id !== food.id &&
      entry.category === food.category
  ).slice(0, 3);

  return (
    <DetailShell
      image={food.image}
      eyebrow={t('food.eyebrow')}
      title={food.name}
      region={foodRegion(t, food) || undefined}
      onBack={() => router.back()}
    >
      <InfoSection title={t('details.about')}>
        <Text style={styles.bodyText}>
          {foodDescription(t, food)}
        </Text>
      </InfoSection>

      <MetaGrid
        category={t(`details.foodCategories.${food.category}`)}
        region={foodRegion(t, food) || undefined}
      />

      <InfoSection title={t('details.ingredients')}>
        <View style={styles.ingredientsCard}>
          <Feather
            name="coffee"
            size={18}
            color={THEME.gold}
          />

          <Text style={styles.ingredientsText}>
            {foodIngredients(food)}
          </Text>
        </View>
      </InfoSection>

      <SourcesBlock
        sources={food.sources}
        imageAttribution={food.imageAttribution}
      />

      {related.length > 0 && (
        <RelatedSection title={t('details.related')}>
          {related.map((entry) => (
            <RelatedCard
              key={entry.id}
              image={entry.image}
              title={entry.name}
              subtitle={
                foodRegion(t, entry) ||
                t(`details.foodCategories.${entry.category}`)
              }
              onPress={() =>
                router.replace(
                  `/discover/food/${entry.id}` as never
                )
              }
            />
          ))}
        </RelatedSection>
      )}
    </DetailShell>
  );
}

function DocumentaryDetail({
  documentary,
}: {
  documentary: EditorialDocumentary;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const related = DOCUMENTARIES.filter(
    (entry) =>
      entry.id !== documentary.id &&
      entry.category === documentary.category
  ).slice(0, 3);

  return (
    <DetailShell
      image={documentary.image}
      eyebrow={t(
        `documentaries.categories.${documentary.category}`
      ).toUpperCase()}
      title={documentaryTitle(documentary)}
      region={
        documentary.region
          ? localizedText(documentary.region)
          : undefined
      }
      onBack={() => router.back()}
    >
      <View style={styles.editorialBadge}>
        <Feather
          name="book-open"
          size={15}
          color={THEME.gold}
        />
        <Text style={styles.editorialText}>
          {t('details.editorialFeature')}
        </Text>
      </View>

      <InfoSection title={t('details.about')}>
        <Text style={styles.bodyText}>
          {documentaryDescription(documentary)}
        </Text>
      </InfoSection>

      <MetaGrid
        category={t(
          `documentaries.categories.${documentary.category}`
        )}
        region={
          documentary.region
            ? localizedText(documentary.region)
            : undefined
        }
      />

      {documentary.youtube ? (
        <Pressable
          onPress={() => openExternal(documentary.youtube!.url)}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            name="play"
            size={17}
            color="#050505"
          />
          <Text style={styles.primaryButtonText}>
            {t('movie.watchNow')}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.videoStatus}>
          <Feather
            name="video"
            size={17}
            color={THEME.gold}
          />
          <Text style={styles.videoStatusText}>
            {t('details.videoComing')}
          </Text>
        </View>
      )}

      <SourcesBlock
        sources={documentary.sources}
        imageAttribution={documentary.imageAttribution}
      />

      {related.length > 0 && (
        <RelatedSection title={t('details.related')}>
          {related.map((entry) => (
            <RelatedCard
              key={entry.id}
              image={entry.image}
              title={documentaryTitle(entry)}
              subtitle={t(
                `documentaries.categories.${entry.category}`
              )}
              onPress={() =>
                router.replace(
                  `/discover/documentary/${entry.id}` as never
                )
              }
            />
          ))}
        </RelatedSection>
      )}
    </DetailShell>
  );
}

function DetailShell({
  image,
  eyebrow,
  title,
  region,
  onBack,
  children,
}: {
  image: CultureItem['image'];
  eyebrow: string;
  title: string;
  region?: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={['top']}
    >
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <Image
            source={image}
            contentFit="cover"
            transition={180}
            style={StyleSheet.absoluteFill}
          />

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.10)',
              'rgba(4,4,4,0.30)',
              '#050505',
            ]}
            locations={[0, 0.48, 1]}
            style={StyleSheet.absoluteFill}
          />

          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="arrow-left"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>

          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>
              {eyebrow}
            </Text>

            <Text style={styles.heroTitle}>
              {title}
            </Text>

            {region && (
              <View style={styles.regionRow}>
                <Feather
                  name="map-pin"
                  size={13}
                  color={THEME.gold}
                />
                <Text style={styles.regionText}>
                  {region}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function MetaGrid({
  category,
  region,
}: {
  category: string;
  region?: string;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.metaGrid}>
      <View style={styles.metaCard}>
        <Feather
          name="grid"
          size={17}
          color={THEME.gold}
        />
        <Text style={styles.metaLabel}>
          {t('details.category')}
        </Text>
        <Text style={styles.metaValue}>
          {category}
        </Text>
      </View>

      {region && (
        <View style={styles.metaCard}>
          <Feather
            name="map-pin"
            size={17}
            color={THEME.gold}
          />
          <Text style={styles.metaLabel}>
            {t('details.region')}
          </Text>
          <Text style={styles.metaValue}>
            {region}
          </Text>
        </View>
      )}
    </View>
  );
}

function SourcesBlock({
  sources,
  imageAttribution,
}: {
  sources: ContentSource[];
  imageAttribution: ImageAttribution;
}) {
  const { t } = useTranslation();

  return (
    <>
      <InfoSection title={t('details.sources')}>
        <View style={styles.sourceList}>
          {sources.map((source, index) => (
            <Pressable
              key={`${source.url}-${index}`}
              onPress={() => openExternal(source.url)}
              style={({ pressed }) => [
                styles.sourceCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.sourceIcon}>
                <Feather
                  name="book-open"
                  size={16}
                  color={THEME.gold}
                />
              </View>

              <View style={styles.sourceTextBlock}>
                <Text
                  style={styles.sourceLabel}
                  numberOfLines={2}
                >
                  {source.label}
                </Text>
                <Text style={styles.sourceHint}>
                  {t('details.sourceDisclaimer')}
                </Text>
              </View>

              <Feather
                name="arrow-up-right"
                size={16}
                color={THEME.goldLight}
              />
            </Pressable>
          ))}
        </View>
      </InfoSection>

      <InfoSection title={t('details.photoCredits')}>
        <View style={styles.creditCard}>
          <View style={styles.creditHeader}>
            <Feather
              name="image"
              size={17}
              color={THEME.gold}
            />
            <Text style={styles.creditAuthor}>
              {imageAttribution.author ??
                t('culture.unknownAuthor')}
            </Text>
          </View>

          <Text style={styles.creditLicense}>
            {imageAttribution.license}
          </Text>

          <Pressable
            onPress={() =>
              openExternal(imageAttribution.sourceUrl)
            }
            style={({ pressed }) => [
              styles.creditButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.creditButtonText}>
              {t('details.viewPhotoSource')}
            </Text>
            <Feather
              name="arrow-up-right"
              size={15}
              color={THEME.gold}
            />
          </Pressable>
        </View>
      </InfoSection>
    </>
  );
}

function RelatedSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.relatedList}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function RelatedCard({
  image,
  title,
  subtitle,
  onPress,
}: {
  image: CultureItem['image'];
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.relatedCard,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={image}
        contentFit="cover"
        transition={150}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.08)',
          'rgba(5,5,5,0.88)',
        ]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.relatedContent}>
        <Text
          style={styles.relatedSubtitle}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
        <Text
          style={styles.relatedTitle}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

function NotFound({
  onBack,
}: {
  onBack: () => void;
}) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.notFound}>
        <Feather
          name="alert-circle"
          size={38}
          color={THEME.gold}
        />
        <Text style={styles.notFoundTitle}>
          {t('details.notFound')}
        </Text>
        <Text style={styles.notFoundText}>
          {t('details.notFoundText')}
        </Text>

        <Pressable
          onPress={onBack}
          style={styles.primaryButton}
        >
          <Feather
            name="arrow-left"
            size={17}
            color="#050505"
          />
          <Text style={styles.primaryButtonText}>
            {t('details.goBack')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function openExternal(url: string) {
  Haptics.selectionAsync();
  Linking.openURL(url).catch((error) =>
    console.warn('Unable to open external URL', error)
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    paddingBottom: 58,
  },
  hero: {
    height: 410,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 30,
  },
  eyebrow: {
    color: THEME.goldLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '800',
    marginTop: 7,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  regionText: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  section: {
    marginTop: 26,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  bodyText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 14,
    lineHeight: 23,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  metaCard: {
    flex: 1,
    minHeight: 112,
    padding: 15,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 10,
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 4,
  },
  ingredientsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 16,
    borderRadius: 21,
    backgroundColor: 'rgba(216,178,92,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.14)',
  },
  ingredientsText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 20,
  },
  editorialBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(216,178,92,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(216,178,92,0.15)',
  },
  editorialText: {
    color: THEME.goldLight,
    fontSize: 10,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 52,
    marginTop: 22,
    borderRadius: 18,
    backgroundColor: THEME.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#050505',
    fontSize: 12,
    fontWeight: '800',
  },
  videoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
    padding: 15,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  videoStatusText: {
    flex: 1,
    color: 'rgba(255,255,255,0.52)',
    fontSize: 11,
    lineHeight: 17,
  },
  sourceList: {
    gap: 9,
  },
  sourceCard: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(216,178,92,0.07)',
  },
  sourceTextBlock: {
    flex: 1,
  },
  sourceLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  sourceHint: {
    color: 'rgba(255,255,255,0.30)',
    fontSize: 9,
    marginTop: 4,
  },
  creditCard: {
    padding: 16,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  creditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  creditAuthor: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  creditLicense: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 10,
    marginTop: 8,
  },
  creditButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 13,
  },
  creditButtonText: {
    color: THEME.gold,
    fontSize: 10,
    fontWeight: '700',
  },
  relatedList: {
    gap: 10,
    paddingRight: 18,
  },
  relatedCard: {
    width: 180,
    height: 215,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: THEME.card,
  },
  relatedContent: {
    position: 'absolute',
    left: 13,
    right: 13,
    bottom: 13,
  },
  relatedSubtitle: {
    color: THEME.goldLight,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  relatedTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: 5,
  },
  pressed: {
    opacity: 0.75,
  },
  notFound: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
  },
  notFoundText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 320,
  },
});
