import React from 'react';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Feather from '@/components/FeatherCompat';
import { THEME } from '@/constants/theme';
import { EditorialDocumentary } from '@/types';
import { documentaryDescription, documentaryTitle, localizedText } from '@/utils/localizedContent';

export function DocumentaryCard({
  documentary,
  onPress,
}: {
  documentary: EditorialDocumentary;
  onPress?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <Image source={documentary.image} contentFit="cover" transition={180} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(0,0,0,0.08)', 'rgba(5,5,5,0.68)', '#050505']} style={StyleSheet.absoluteFill} />

      <View style={styles.topRow}>
        <Text style={styles.category}>{t(`documentaries.categories.${documentary.category}`).toUpperCase()}</Text>
        <View style={styles.lockedBadge}>
          <Feather name="book-open" size={12} color={THEME.goldLight} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{documentaryTitle(documentary)}</Text>
        {documentary.region && (
          <View style={styles.regionRow}>
            <Feather name="map-pin" size={11} color={THEME.goldLight} />
            <Text style={styles.region}>{localizedText(documentary.region)}</Text>
          </View>
        )}
        <Text style={styles.description} numberOfLines={3}>{documentaryDescription(documentary)}</Text>
        <Text style={styles.status}>{t('documentaries.catalogueOnly')}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 278,
    height: 330,
    borderRadius: 27,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: THEME.card,
  },
  topRow: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category: {
    color: THEME.goldLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  lockedBadge: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  content: { position: 'absolute', left: 17, right: 17, bottom: 17 },
  title: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 },
  region: { color: 'rgba(255,255,255,0.58)', fontSize: 10 },
  description: { color: 'rgba(255,255,255,0.66)', fontSize: 12, lineHeight: 18, marginTop: 10 },
  status: { color: THEME.gold, fontSize: 9, fontWeight: '700', marginTop: 12 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
