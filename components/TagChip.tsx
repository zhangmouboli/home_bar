import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface TagChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export default function TagChip({ label, active, onPress }: TagChipProps) {
  return (
    <Pressable
      style={[styles.chip, active && styles.activeChip]}
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.borderRadius.pill,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.outline,
    marginRight: spacing.sm,
  },
  activeChip: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
  },
  text: {
    ...typography.labelMd,
    color: colors.textMuted,
  },
  activeText: {
    color: colors.primary,
  },
});
