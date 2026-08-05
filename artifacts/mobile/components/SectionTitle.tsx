import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/constants/theme';

interface SectionTitleProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionTitle({ title, onSeeAll }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.accent} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={10}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accent: {
    width: 3,
    height: 18,
    backgroundColor: THEME.gold,
    borderRadius: 2,
  },
  title: {
    color: THEME.text,
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.3,
  },
  seeAll: {
    color: THEME.gold,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});
