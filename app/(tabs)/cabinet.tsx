import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { categoryLabels } from '../../data/mock';
import { useApp } from '../../hooks/useApp';
import AppHeader from '../../components/AppHeader';
import IngredientItem from '../../components/IngredientItem';
import TagChip from '../../components/TagChip';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import AddIngredientModal from '../../components/AddIngredientModal';

const quickAdd = [
  { id: 'vodka', name: '伏特加' },
  { id: 'gin', name: '金酒' },
  { id: 'white_rum', name: '朗姆酒' },
  { id: 'whiskey', name: '威士忌' },
  { id: 'lemon_juice', name: '柠檬汁' },
  { id: 'soda_water', name: '苏打水' },
];

const categories = [
  { key: 'all', label: '全部' },
  { key: 'base', label: '基酒' },
  { key: 'liqueur', label: '利口酒' },
  { key: 'juice', label: '果汁' },
  { key: 'syrup', label: '糖浆' },
  { key: 'mixer', label: '苏打/气泡' },
  { key: 'bitter', label: '苦精' },
  { key: 'garnish', label: '装饰' },
  { key: 'other', label: '其他' },
];

export default function CabinetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, toggleIngredient, isIngredientOwned, allIngredients, addCustomIngredient, removeCustomIngredient, updateCustomIngredient } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<import('../../types').Ingredient | null>(null);

  const handleSaveIngredient = (input: { name: string; nameEn?: string; category: import('../../types').IngredientCategory }) => {
    if (editingIngredient) {
      updateCustomIngredient(editingIngredient.id, input);
    } else {
      const id = `custom-ingredient-${Date.now()}`;
      addCustomIngredient({ id, name: input.name, nameEn: input.nameEn, category: input.category, icon: 'local-bar' });
      toggleIngredient(id);
    }
    setShowAddModal(false);
    setEditingIngredient(null);
  };

  const filtered = useMemo(() => {
    let list = allIngredients;
    if (activeCategory !== 'all') {
      list = list.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((i) => {
        const nameMatch = i.name.toLowerCase().includes(q) || (i.nameEn && i.nameEn.toLowerCase().includes(q));
        const categoryLabel = categoryLabels[i.category] || '';
        const categoryMatch = categoryLabel.toLowerCase().includes(q);
        return nameMatch || categoryMatch;
      });
    }
    return list;
  }, [activeCategory, search, allIngredients]);

  return (
    <View style={styles.root}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>我的酒柜</Text>
          <Text style={styles.count}>{state.ownedIngredientIds.length} 项</Text>
        </View>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="搜索材料或分类..."
        />

        <TouchableOpacity style={styles.addBtn} onPress={() => { setEditingIngredient(null); setShowAddModal(true); }} activeOpacity={0.7}>
          <MaterialIcons name="add" size={20} color={colors.primary} />
          <Text style={styles.addBtnText}>添加自定义材料</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>快速添加</Text>
        <View style={styles.quickRow}>
          {quickAdd.map((item) => {
            const owned = isIngredientOwned(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickChip, owned && styles.quickChipActive]}
                onPress={() => toggleIngredient(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.quickText, owned && styles.quickTextActive]}>
                  {item.name}
                </Text>
                {owned && <MaterialIcons name="check" size={14} color={colors.primary} style={{ marginLeft: 4 }} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsContent}>
          {categories.map((cat) => (
            <TagChip
              key={cat.key}
              label={cat.label}
              active={activeCategory === cat.key}
              onPress={() => setActiveCategory(cat.key)}
            />
          ))}
        </ScrollView>

        <View style={styles.listSection}>
          {filtered.length === 0 ? (
            <EmptyState
              icon="search-off"
              message="没有找到相关材料"
              actionLabel="清除搜索"
              onAction={() => setSearch('')}
            />
          ) : (
            filtered.map((item) => (
              <IngredientItem
                key={item.id}
                name={item.name}
                category={categoryLabels[item.category] || item.category}
                icon={item.icon}
                owned={isIngredientOwned(item.id)}
                onToggle={() => toggleIngredient(item.id)}
                onEdit={item.id.startsWith('custom-ingredient-') ? () => { setEditingIngredient(item); setShowAddModal(true); } : undefined}
                onDelete={item.id.startsWith('custom-ingredient-') ? () => {
                  Alert.alert('删除材料', `确定要删除「${item.name}」吗？`, [
                    { text: '取消', style: 'cancel' },
                    { text: '删除', style: 'destructive', onPress: () => removeCustomIngredient(item.id) },
                  ]);
                } : undefined}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBtn, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
        <TouchableOpacity style={styles.cta} onPress={() => router.push('/recommend')} activeOpacity={0.7}>
          <MaterialIcons name="auto-awesome" size={20} color={colors.background} />
          <Text style={styles.ctaText}>看看我能调什么</Text>
        </TouchableOpacity>
      </View>

      <AddIngredientModal
        visible={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingIngredient(null); }}
        onSave={handleSaveIngredient}
        title={editingIngredient ? '编辑材料' : '添加自定义材料'}
        initialValues={editingIngredient ? { name: editingIngredient.name, nameEn: editingIngredient.nameEn, category: editingIngredient.category } : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 160,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.headlineXl,
    color: colors.text,
  },
  count: {
    ...typography.labelLg,
    color: colors.primary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(242, 202, 80, 0.06)',
  },
  addBtnText: {
    ...typography.labelLg,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  sectionLabel: {
    ...typography.labelLg,
    color: colors.textMuted,
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.pill,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  quickChipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
  },
  quickText: {
    ...typography.labelMd,
    color: colors.textMuted,
  },
  quickTextActive: {
    color: colors.primary,
  },
  tabsScroll: {
    marginBottom: spacing.md,
  },
  tabsContent: {
    paddingHorizontal: spacing.pageMargin,
  },
  listSection: {
    marginBottom: spacing.lg,
  },
  bottomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pageMargin,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: 'rgba(19, 19, 19, 0.88)',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
  },
  ctaText: {
    ...typography.labelLg,
    color: colors.background,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});
