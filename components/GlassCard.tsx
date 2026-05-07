import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function GlassCard({ children, style, noPadding }: GlassCardProps) {
  return (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(31, 31, 31, 0.78)',
    borderRadius: spacing.borderRadius.xxl,
    padding: spacing.cardPadding,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  noPadding: {
    padding: 0,
  },
});
