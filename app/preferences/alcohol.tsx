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
import GlassCard from '../../components/GlassCard';

type AlcoholLevel = 'low' | 'medium' | 'high' | 'any';

const alcoholOptions: { key: AlcoholLevel; label: string; desc: string }[] = [
  { key: 'low', label: '低酒精', desc: '适合轻松小酌，酒精度较低' },
  { key: 'medium', label: '中等', desc: '经典鸡尾酒的常见酒精度' },
  { key: 'high', label: '偏高', desc: '烈酒基底，口感强烈' },
  { key: 'any', label: '无所谓', desc: '不做限制，全部推荐' },
];

export default function AlcoholScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, setPreferredAlcoholLevel } = useApp();
  const [selected, setSelected] = useState<AlcoholLevel>(state.preferredAlcoholLevel);

  const handleSave = () => {
    setPreferredAlcoholLevel(selected);
    Alert.alert('提示', '酒精度偏好已保存', [
      { text: '好的', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>酒精度偏好</Text>
        <Text style={styles.subtitle}>选择你偏好的酒精浓度</Text>

        <GlassCard style={styles.card}>
          {alcoholOptions.map((option, i) => {
            const isActive = selected === option.key;
            return (
              <React.Fragment key={option.key}>
                {i > 0 && <View style={styles.divider} />}
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setSelected(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>{option.label}</Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </View>
                  <View style={[styles.radio, isActive && styles.radioActive]}>
                    {isActive && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </GlassCard>
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
  card: {
    marginHorizontal: spacing.pageMargin,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    ...typography.labelLg,
    color: colors.text,
  },
  optionLabelActive: {
    color: colors.primary,
  },
  optionDesc: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
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
