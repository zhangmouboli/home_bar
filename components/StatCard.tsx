import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  onPress?: () => void;
}

export default function StatCard({ icon, value, label, onPress }: StatCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <MaterialIcons name={icon as any} size={22} color={colors.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: spacing.borderRadius.xl,
    padding: spacing.cardPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  value: {
    ...typography.headlineLg,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  label: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
