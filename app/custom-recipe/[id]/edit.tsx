import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { useApp } from '../../../hooks/useApp';
import AppHeader from '../../../components/AppHeader';
import GlassCard from '../../../components/GlassCard';
import TagChip from '../../../components/TagChip';

const difficultyOptions = [
  { key: '简单', label: '简单' },
  { key: '中等', label: '中等' },
  { key: '困难', label: '困难' },
];

const alcoholOptions = [
  { key: '低等', label: '低酒精' },
  { key: '中等', label: '中等' },
  { key: '偏高', label: '偏高' },
];

export default function EditCustomRecipeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allIngredients, allCocktails, updateCustomCocktail } = useApp();

  const cocktail = useMemo(() => allCocktails.find((c) => c.id === id), [id, allCocktails]);

  const [nameZh, setNameZh] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [difficulty, setDifficulty] = useState('简单');
  const [timeMinutes, setTimeMinutes] = useState('5');
  const [alcoholLevel, setAlcoholLevel] = useState('中等');
  const [toolsInput, setToolsInput] = useState('');
  const [tip, setTip] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<{ ingredientId: string; amount: string }[]>([]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (cocktail && !initialized) {
      setNameZh(cocktail.nameZh);
      setNameEn(cocktail.nameEn);
      setSubtitle(cocktail.subtitle);
      setTagsInput(cocktail.tags.join(', '));
      setDifficulty(cocktail.difficulty);
      setTimeMinutes(String(cocktail.timeMinutes));
      setAlcoholLevel(cocktail.alcoholLevel);
      setToolsInput(cocktail.tools.join(', '));
      setTip(cocktail.tip || '');
      setSelectedIngredients(cocktail.ingredients.map((ci) => ({ ingredientId: ci.ingredientId, amount: ci.amount })));
      setSteps(cocktail.steps.length > 0 ? cocktail.steps : ['']);
      setInitialized(true);
    }
  }, [cocktail, initialized]);

  if (!cocktail) {
    return (
      <View style={styles.root}>
        <AppHeader showBack fallbackRoute="/recipes" />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>未找到该酒谱</Text>
        </View>
      </View>
    );
  }

  const toggleIngredientSelection = (ingredientId: string) => {
    const exists = selectedIngredients.find((s) => s.ingredientId === ingredientId);
    if (exists) {
      setSelectedIngredients(selectedIngredients.filter((s) => s.ingredientId !== ingredientId));
    } else {
      setSelectedIngredients([...selectedIngredients, { ingredientId, amount: '' }]);
    }
  };

  const updateIngredientAmount = (ingredientId: string, amount: string) => {
    setSelectedIngredients(selectedIngredients.map((s) => s.ingredientId === ingredientId ? { ...s, amount } : s));
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) => setSteps(steps.map((s, i) => i === index ? value : s));

  const handleSave = () => {
    if (!nameZh.trim()) {
      Alert.alert('提示', '请输入中文名称');
      return;
    }
    if (selectedIngredients.length === 0) {
      Alert.alert('提示', '请至少选择一种材料');
      return;
    }
    const validSteps = steps.filter((s) => s.trim());
    if (validSteps.length === 0) {
      Alert.alert('提示', '请至少添加一个制作步骤');
      return;
    }
    const parsedTime = parseInt(timeMinutes, 10);
    if (!timeMinutes.trim() || isNaN(parsedTime) || parsedTime <= 0) {
      Alert.alert('提示', '请输入有效的用时（分钟）');
      return;
    }
    const emptyAmount = selectedIngredients.find((s) => !s.amount.trim());
    if (emptyAmount) {
      const ing = allIngredients.find((i) => i.id === emptyAmount.ingredientId);
      Alert.alert('提示', `请填写「${ing?.name || emptyAmount.ingredientId}」的用量`);
      return;
    }

    const tags = tagsInput.split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
    const tools = toolsInput.split(/[,，、]/).map((t) => t.trim()).filter(Boolean);

    updateCustomCocktail(cocktail.id, {
      nameZh: nameZh.trim(),
      nameEn: nameEn.trim(),
      subtitle: subtitle.trim() || nameZh.trim(),
      tags,
      difficulty,
      timeMinutes: parsedTime,
      alcoholLevel,
      ingredients: selectedIngredients,
      steps: validSteps,
      tools,
      tip: tip.trim() || undefined,
    });

    router.back();
  };

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute={`/recipe/${id}`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>编辑酒谱</Text>
        <Text style={styles.subtitle}>{cocktail.nameZh}</Text>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>中文名 *</Text>
          <TextInput style={styles.input} value={nameZh} onChangeText={setNameZh} placeholder="例如：我的特调莫吉托" placeholderTextColor={colors.outline} />

          <Text style={styles.label}>英文名</Text>
          <TextInput style={styles.input} value={nameEn} onChangeText={setNameEn} placeholder="例如：My Special Mojito" placeholderTextColor={colors.outline} />

          <Text style={styles.label}>简介</Text>
          <TextInput style={styles.input} value={subtitle} onChangeText={setSubtitle} placeholder="一句话描述这杯酒" placeholderTextColor={colors.outline} />

          <Text style={styles.label}>标签（逗号分隔）</Text>
          <TextInput style={styles.input} value={tagsInput} onChangeText={setTagsInput} placeholder="例如：清爽, 夏日, 派对" placeholderTextColor={colors.outline} />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>难度</Text>
          <View style={styles.optionRow}>
            {difficultyOptions.map((opt) => (
              <TagChip key={opt.key} label={opt.label} active={difficulty === opt.key} onPress={() => setDifficulty(opt.key)} />
            ))}
          </View>

          <Text style={styles.label}>用时（分钟）</Text>
          <TextInput style={styles.input} value={timeMinutes} onChangeText={setTimeMinutes} keyboardType="number-pad" placeholder="5" placeholderTextColor={colors.outline} />

          <Text style={styles.label}>酒精度</Text>
          <View style={styles.optionRow}>
            {alcoholOptions.map((opt) => (
              <TagChip key={opt.key} label={opt.label} active={alcoholLevel === opt.key} onPress={() => setAlcoholLevel(opt.key)} />
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>所需材料 *</Text>
            <TouchableOpacity onPress={() => setShowIngredientPicker(!showIngredientPicker)} activeOpacity={0.7}>
              <Text style={styles.actionText}>{showIngredientPicker ? '收起' : '选择材料'}</Text>
            </TouchableOpacity>
          </View>

          {selectedIngredients.length > 0 && (
            <View style={styles.selectedList}>
              {selectedIngredients.map((s) => {
                const ing = allIngredients.find((i) => i.id === s.ingredientId);
                return (
                  <View key={s.ingredientId} style={styles.selectedRow}>
                    <Text style={styles.selectedName}>{ing?.name || s.ingredientId}</Text>
                    <TextInput
                      style={styles.amountInput}
                      value={s.amount}
                      onChangeText={(v) => updateIngredientAmount(s.ingredientId, v)}
                      placeholder="用量"
                      placeholderTextColor={colors.outline}
                    />
                    <TouchableOpacity onPress={() => toggleIngredientSelection(s.ingredientId)}>
                      <MaterialIcons name="close" size={18} color={colors.outlineLight} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {showIngredientPicker && (
            <View style={styles.pickerList}>
              {allIngredients.map((ing) => {
                const selected = selectedIngredients.some((s) => s.ingredientId === ing.id);
                return (
                  <TouchableOpacity
                    key={ing.id}
                    style={[styles.pickerItem, selected && styles.pickerItemActive]}
                    onPress={() => toggleIngredientSelection(ing.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name={selected ? 'check-box' : 'check-box-outline-blank'} size={20} color={selected ? colors.primary : colors.outline} />
                    <Text style={[styles.pickerText, selected && styles.pickerTextActive]}>{ing.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>制作步骤 *</Text>
            <TouchableOpacity onPress={addStep} activeOpacity={0.7}>
              <Text style={styles.actionText}>+ 添加步骤</Text>
            </TouchableOpacity>
          </View>
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={step}
                onChangeText={(v) => updateStep(i, v)}
                placeholder={`步骤 ${i + 1}`}
                placeholderTextColor={colors.outline}
                multiline
              />
              {steps.length > 1 && (
                <TouchableOpacity onPress={() => removeStep(i)} style={{ marginLeft: spacing.xs }}>
                  <MaterialIcons name="remove-circle-outline" size={22} color={colors.outlineLight} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>所需工具（逗号分隔）</Text>
          <TextInput style={styles.input} value={toolsInput} onChangeText={setToolsInput} placeholder="例如：搅拌棒, 摇酒壶" placeholderTextColor={colors.outline} />

          <Text style={styles.label}>小贴士</Text>
          <TextInput style={[styles.input, { minHeight: 60 }]} value={tip} onChangeText={setTip} placeholder="可选的调酒小贴士" placeholderTextColor={colors.outline} multiline />
        </GlassCard>

        <TouchableOpacity style={[styles.saveBtn, { marginBottom: insets.bottom + spacing.lg }]} onPress={handleSave} activeOpacity={0.7}>
          <MaterialIcons name="check" size={22} color={colors.background} />
          <Text style={styles.saveBtnText}>保存修改</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  scroll: {
    paddingBottom: 40,
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
    marginBottom: spacing.md,
  },
  label: {
    ...typography.labelLg,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    ...typography.bodyMd,
    color: colors.text,
    backgroundColor: colors.surfaceHigh,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  selectedList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectedName: {
    ...typography.bodyMd,
    color: colors.text,
    minWidth: 80,
  },
  amountInput: {
    ...typography.bodyMd,
    color: colors.text,
    backgroundColor: colors.surfaceHigh,
    borderRadius: spacing.borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flex: 1,
  },
  pickerList: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  pickerItemActive: {
    opacity: 1,
  },
  pickerText: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  pickerTextActive: {
    color: colors.primary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.sm + 2,
  },
  stepNumText: {
    ...typography.labelSm,
    color: colors.background,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.pageMargin,
    marginTop: spacing.md,
  },
  saveBtnText: {
    ...typography.labelLg,
    color: colors.background,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
