import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChangeText, placeholder = '搜索...' }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color={colors.outlineLight} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outlineLight}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: spacing.borderRadius.xl,
    paddingHorizontal: spacing.cardPadding,
    paddingVertical: spacing.sm + 4,
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  input: {
    ...typography.bodyMd,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
    padding: 0,
  },
});
