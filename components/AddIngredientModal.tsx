import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { IngredientCategory } from '../types';
import { categoryLabels } from '../data/mock';

interface AddIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (input: { name: string; nameEn?: string; category: IngredientCategory }) => void;
  title?: string;
  initialValues?: { name: string; nameEn?: string; category: IngredientCategory };
}

const categoryOptions: { key: IngredientCategory; label: string }[] = [
  { key: 'base', label: '基酒' },
  { key: 'liqueur', label: '利口酒' },
  { key: 'juice', label: '果汁' },
  { key: 'syrup', label: '糖浆' },
  { key: 'mixer', label: '苏打/气泡' },
  { key: 'bitter', label: '苦精' },
  { key: 'garnish', label: '装饰' },
  { key: 'other', label: '其他' },
];

export default function AddIngredientModal({ visible, onClose, onSave, title, initialValues }: AddIngredientModalProps) {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('other');

  useEffect(() => {
    if (visible && initialValues) {
      setName(initialValues.name);
      setNameEn(initialValues.nameEn || '');
      setCategory(initialValues.category);
    } else if (visible) {
      setName('');
      setNameEn('');
      setCategory('other');
    }
  }, [visible, initialValues]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, nameEn: nameEn.trim() || undefined, category });
    if (!initialValues) {
      setName('');
      setNameEn('');
      setCategory('other');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title || '添加自定义材料'}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>材料名称 *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例如：椰子利口酒"
              placeholderTextColor={colors.outline}
            />

            <Text style={styles.label}>英文名（可选）</Text>
            <TextInput
              style={styles.input}
              value={nameEn}
              onChangeText={setNameEn}
              placeholder="例如：Coconut Liqueur"
              placeholderTextColor={colors.outline}
            />

            <Text style={styles.label}>分类</Text>
            <View style={styles.categoryGrid}>
              {categoryOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.categoryChip, category === opt.key && styles.categoryChipActive]}
                  onPress={() => setCategory(opt.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryText, category === opt.key && styles.categoryTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!name.trim()}
            >
              <Text style={styles.saveText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: spacing.borderRadius.xl,
    borderTopRightRadius: spacing.borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.headlineMd,
    color: colors.text,
  },
  label: {
    ...typography.labelLg,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.pill,
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
  },
  categoryText: {
    ...typography.labelMd,
    color: colors.textMuted,
  },
  categoryTextActive: {
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.surfaceHigh,
  },
  cancelText: {
    ...typography.labelLg,
    color: colors.textMuted,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.primary,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveText: {
    ...typography.labelLg,
    color: colors.background,
    fontWeight: '600',
  },
});
