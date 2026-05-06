import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { cocktails, ingredients } from '../../data/mock';
import { useApp } from '../../hooks/useApp';
import GlassCard from '../../components/GlassCard';

export default function MakeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addMadeCocktail } = useApp();
  const [step, setStep] = useState(0);

  const cocktail = useMemo(() => cocktails.find((c) => c.id === id), [id]);

  useEffect(() => {
    setStep(0);
  }, [id]);

  // Clamp step if cocktail changes to one with fewer steps
  const totalSteps = cocktail?.steps.length ?? 0;
  const safeStep = totalSteps > 0 ? Math.min(step, totalSteps - 1) : 0;

  if (!cocktail) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>没有找到这款鸡尾酒</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.emptyBtnText}>返回</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isLast = safeStep === totalSteps - 1;
  const isFirst = safeStep === 0;
  const currentStep = cocktail.steps[safeStep];

  const handlePrev = () => {
    if (!isFirst) setStep(safeStep - 1);
  };

  const handleNext = () => {
    if (!isLast) {
      setStep(safeStep + 1);
    } else {
      addMadeCocktail(cocktail.id);
      Alert.alert('制作完成', `已记录制作：${cocktail.nameZh}`, [
        { text: '好的', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>制作 {cocktail.nameZh}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>步骤 {safeStep + 1} / {totalSteps}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((safeStep + 1) / totalSteps) * 100}%` }]} />
          </View>
        </View>

        <GlassCard style={styles.stepCard}>
          <View style={styles.stepNumWrap}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{safeStep + 1}</Text>
            </View>
          </View>
          <Text style={styles.stepText}>{currentStep}</Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>所需工具</Text>
        <View style={styles.toolsRow}>
          {cocktail.tools.map((t) => (
            <View key={t} style={styles.toolChip}>
              <MaterialIcons name="build" size={16} color={colors.textMuted} />
              <Text style={styles.toolText}>{t}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>所需材料</Text>
        {cocktail.ingredients.map((ci) => {
          const ing = ingredients.find((i) => i.id === ci.ingredientId);
          return (
            <View key={ci.ingredientId} style={styles.ingredientRow}>
              <MaterialIcons name="check-circle" size={20} color={colors.success} />
              <Text style={styles.ingredientName}>{ing?.name || ci.ingredientId}</Text>
              <Text style={styles.ingredientAmount}>{ci.amount}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.pageMargin }]}>
        <TouchableOpacity
          style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={isFirst}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={20} color={isFirst ? colors.outline : colors.text} />
          <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>上一步</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimary]} onPress={handleNext} activeOpacity={0.7}>
          <Text style={styles.navBtnTextPrimary}>{isLast ? '完成制作' : '下一步'}</Text>
          {!isLast && <MaterialIcons name="arrow-forward" size={20} color={colors.background} />}
          {isLast && <MaterialIcons name="check" size={20} color={colors.background} />}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: spacing.md,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: spacing.pageMargin,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.text,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: 160,
  },
  progressRow: {
    marginBottom: spacing.lg,
  },
  progressText: {
    ...typography.labelLg,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceHigh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  stepNumWrap: {
    marginBottom: spacing.md,
  },
  stepNum: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    ...typography.headlineLg,
    color: colors.background,
    fontWeight: '700',
  },
  stepText: {
    ...typography.headlineMd,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  sectionTitle: {
    ...typography.labelLg,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  toolText: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ingredientName: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  ingredientAmount: {
    ...typography.labelMd,
    color: colors.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.pageMargin,
    backgroundColor: 'rgba(19, 19, 19, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: spacing.sm,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  navBtnText: {
    ...typography.labelLg,
    color: colors.text,
    marginHorizontal: spacing.xs,
  },
  navBtnTextDisabled: {
    color: colors.outline,
  },
  navBtnTextPrimary: {
    ...typography.labelLg,
    color: colors.background,
    fontWeight: '600',
    marginHorizontal: spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  emptyBtn: {
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emptyBtnText: {
    ...typography.labelLg,
    color: colors.primary,
  },
});
