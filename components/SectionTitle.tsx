import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SectionTitleProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

export default function SectionTitle({ title, actionText, onAction }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineMd,
    color: colors.text,
  },
  action: {
    ...typography.labelMd,
    color: colors.primary,
  },
});
