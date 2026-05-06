import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useApp } from '../../hooks/useApp';
import AppHeader from '../../components/AppHeader';

const flavorOptions = [
  '清爽', '酸甜', '微苦', '果香', '草本',
  '烟熏', '甜口', '低酒精', '经典', '派对',
];

export default function FlavorsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setPreferredFlavorTags } = useApp();
  const [selected, setSelected] = useState<string[]>(state.preferredFlavorTags);

  const toggleTag = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    setPreferredFlavorTags(selected);
    Alert.alert('提示', '偏好已保存', [
      { text: '好的', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>喜欢的口味</Text>
        <Text style={styles.subtitle}>选择你喜欢的口味标签，我们会优先推荐相关酒谱</Text>

        <View style={styles.tagGrid}>
          {flavorOptions.map((tag) => {
            const isActive = selected.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isActive && styles.tagChipActive]}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
              >
                {isActive && <MaterialIcons name="check" size={16} color={colors.background} style={{ marginRight: 4 }} />}
                <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.pageMargin }]}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.saveBtnText}>保存偏好</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 120,
  },
  title: {
    ...typography.headlineXl,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textMuted,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.pageMargin,
    gap: spacing.sm,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  tagChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    ...typography.labelLg,
    color: colors.textMuted,
  },
  tagTextActive: {
    color: colors.background,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.pageMargin,
    backgroundColor: 'rgba(19, 19, 19, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveBtnText: {
    ...typography.labelLg,
    color: colors.background,
    fontWeight: '600',
  },
});
