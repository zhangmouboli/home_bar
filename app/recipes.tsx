import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { cocktails, ownedIngredientIds } from '../data/mock';
import { getCocktailMatch } from '../utils/match';
import AppHeader from '../components/AppHeader';
import GlassCard from '../components/GlassCard';
import TagChip from '../components/TagChip';

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
  const [activeFilter, setActiveFilter] = useState('all');

  const matches = useMemo(
    () => cocktails.map((c) => getCocktailMatch(c, ownedIngredientIds)),
    []
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return matches;
    if (activeFilter === 'beginner') return matches.filter((m) => m.cocktail.tags.includes('新手友好'));
    if (activeFilter === 'classic') return matches.filter((m) => m.cocktail.tags.includes('经典'));
    if (activeFilter === 'summer') return matches.filter((m) => m.cocktail.tags.includes('清爽'));
    if (activeFilter === 'party') return matches.filter((m) => m.cocktail.tags.includes('派对'));
    if (activeFilter === 'low') return matches.filter((m) => m.cocktail.alcoholLevel === '低等');
    return matches;
  }, [activeFilter, matches]);

  return (
    <View style={styles.root}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>酒谱库</Text>
        <Text style={styles.subtitle}>探索并调制您的下一款招牌饮品。</Text>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={colors.outlineLight} />
          <Text style={styles.searchPlaceholder}>搜索鸡尾酒或配料...</Text>
          <MaterialIcons name="tune" size={20} color={colors.outlineLight} />
        </View>

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

        {filtered.map((m) => (
          <TouchableOpacity key={m.cocktail.id} onPress={() => router.push(`/recipe/${m.cocktail.id}`)}>
            <GlassCard style={styles.recipeCard} noPadding>
              <Image source={{ uri: m.cocktail.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <View style={styles.recipeHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recipeName}>{m.cocktail.nameZh}</Text>
                    <Text style={styles.recipeSub}>{m.cocktail.subtitle}</Text>
                  </View>
                  <TouchableOpacity>
                    <MaterialIcons name="favorite-border" size={22} color={colors.textMuted} />
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
        ))}
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
  searchBar: {
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
  searchPlaceholder: {
    ...typography.bodyMd,
    color: colors.outlineLight,
    marginLeft: spacing.sm,
    flex: 1,
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
