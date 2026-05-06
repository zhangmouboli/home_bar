import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { getCocktailMatch } from '../utils/match';
import { getCocktailImageSource } from '../utils/images';
import { useApp } from '../hooks/useApp';
import AppHeader from '../components/AppHeader';
import GlassCard from '../components/GlassCard';
import TagChip from '../components/TagChip';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';

const filters = [
  { key: 'all', label: '全部' },
  { key: 'classic', label: '经典鸡尾酒' },
  { key: 'beginner', label: '新手友好' },
  { key: 'low', label: '低酒精' },
  { key: 'party', label: '派对推荐' },
  { key: 'summer', label: '夏日清爽' },
];

export default function RecipesScreen() {
  const router = useRouter();
  const { state, toggleFavorite, isCocktailFavorite, allCocktails, allIngredients } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const matches = useMemo(
    () => allCocktails.map((c) => getCocktailMatch(c, state.ownedIngredientIds, allIngredients)),
    [allCocktails, state.ownedIngredientIds, allIngredients]
  );

  const filtered = useMemo(() => {
    let list = matches;
    if (activeFilter === 'beginner') list = list.filter((m) => m.cocktail.tags.includes('新手友好'));
    else if (activeFilter === 'classic') list = list.filter((m) => m.cocktail.tags.includes('经典'));
    else if (activeFilter === 'summer') list = list.filter((m) => m.cocktail.tags.includes('清爽'));
    else if (activeFilter === 'party') list = list.filter((m) => m.cocktail.tags.includes('派对'));
    else if (activeFilter === 'low') list = list.filter((m) => m.cocktail.alcoholLevel === '低等');
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((m) => {
        const nameMatch =
          m.cocktail.nameZh.toLowerCase().includes(q) ||
          m.cocktail.nameEn.toLowerCase().includes(q);
        const tagMatch = m.cocktail.tags.some((t) => t.includes(q));
        const ingredientMatch = m.cocktail.ingredients.some((ci) => {
          const ing = allIngredients.find((i) => i.id === ci.ingredientId);
          return ing && (ing.name.toLowerCase().includes(q) || (ing.nameEn && ing.nameEn.toLowerCase().includes(q)));
        });
        return nameMatch || tagMatch || ingredientMatch;
      });
    }
    return list;
  }, [activeFilter, matches, search, allIngredients]);

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>酒谱库</Text>
        <Text style={styles.subtitle}>探索并调制您的下一款招牌饮品。</Text>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="搜索鸡尾酒、配料或标签..."
        />

        <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/custom-recipe/new')} activeOpacity={0.7}>
          <MaterialIcons name="add" size={20} color={colors.primary} />
          <Text style={styles.createBtnText}>+ 创建自定义酒谱</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {filters.map((f) => (
            <TagChip
              key={f.key}
              label={f.label}
              active={activeFilter === f.key}
              onPress={() => setActiveFilter(f.key)}
            />
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <EmptyState
            icon="search-off"
            message="没有找到相关酒谱"
            actionLabel="清除搜索"
            onAction={() => setSearch('')}
          />
        ) : (
          filtered.map((m) => (
            <TouchableOpacity key={m.cocktail.id} onPress={() => router.push(`/recipe/${m.cocktail.id}`)} activeOpacity={0.7}>
              <GlassCard style={styles.recipeCard} noPadding>
                <Image source={getCocktailImageSource(m.cocktail.id)} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recipeName}>{m.cocktail.nameZh}</Text>
                      <Text style={styles.recipeSub}>{m.cocktail.subtitle}</Text>
                    </View>
                    <TouchableOpacity onPress={() => toggleFavorite(m.cocktail.id)} activeOpacity={0.7}>
                      <MaterialIcons
                        name={isCocktailFavorite(m.cocktail.id) ? 'favorite' : 'favorite-border'}
                        size={22}
                        color={isCocktailFavorite(m.cocktail.id) ? colors.primary : colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="check-circle" size={14} color={m.status === 'canMake' ? colors.success : colors.outline} />
                      <Text style={styles.metaText}>
                        已拥有 {m.ownedCount}/{m.totalRequired}
                      </Text>
                    </View>
                    {m.missingCount > 0 && (
                      <View style={styles.metaItem}>
                        <MaterialIcons name="remove-circle-outline" size={14} color={colors.primary} />
                        <Text style={[styles.metaText, { color: colors.primary }]}>
                          缺少 {m.missingIngredients.map((i) => i.name).join('、')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.tagRow}>
                    {m.cocktail.tags.map((t) => (
                      <Text key={t} style={styles.tag}>{t}</Text>
                    ))}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 100,
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
  createBtn: {
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
  createBtnText: {
    ...typography.labelLg,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  filterScroll: {
    marginBottom: spacing.lg,
  },
  filterContent: {
    paddingHorizontal: spacing.pageMargin,
  },
  recipeCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
  },
  recipeImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: spacing.cardPadding,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recipeName: {
    ...typography.headlineMd,
    color: colors.text,
  },
  recipeSub: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
  },
  recipeMeta: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginLeft: 6,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    ...typography.labelSm,
    color: colors.outlineLight,
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.pill,
    marginRight: spacing.xs,
    overflow: 'hidden',
  },
});
