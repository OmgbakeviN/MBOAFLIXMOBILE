import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Feather from '@/components/FeatherCompat';

import { THEME } from '@/constants/theme';

interface SectionTitleProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionTitle({
  title,
  onSeeAll,
}: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {onSeeAll && (
        <Pressable
          onPress={onSeeAll}
          style={styles.action}
          hitSlop={10}
        >
          <Text style={styles.seeAll}>
            See all
          </Text>

          <Feather
            name="chevron-right"
            size={16}
            color={THEME.gold}
          />
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

    paddingHorizontal: 18,

    marginBottom: 15,
  },

  title: {
    color: '#FFFFFF',

    fontSize: 21,
    fontWeight: '750',

    letterSpacing: -0.35,
  },

  action: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 2,
  },

  seeAll: {
    color: THEME.gold,

    fontSize: 12,
    fontWeight: '600',
  },
});