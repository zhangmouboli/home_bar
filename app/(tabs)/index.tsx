import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { getCocktailMatch } from '../../utils/match';
import { useApp } from '../../hooks/useApp';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';
import SectionTitle from '../../components/SectionTitle';
import TagChip from '../../components/TagChip';
import CocktailImageCard from '../../components/CocktailImageCard';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';

const quickTags = ['简单', '清爽', '低酒精', '派对'];

export default function HomeScreen() {
  const router = useRouter();
  const { state, allCocktails, allIngredients } = useApp();
  const [search, setSearch] = useState('');

  const matches = useMemo(
    () => allCocktails.map((c) => getCocktailMatch(c, state.ownedIngredientIds, allIngredients)),
    [allCocktails, state.ownedIngredientIds, allIngredients]
  );

  const canMake = matches.filter((m) => m.status === 'canMake');
  const missingOne = matches.filter((m) => m.status === 'missingOne');

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allCocktails.filter(
      (c) =>
        c.nameZh.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
    );
  }, [search, allCocktails]);

  return (
    <View style={styles.root}>
      <AppHeader onProfilePress={() => router.push('/profile')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.greeting}>今晚想喝什么？</Text>

        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="搜索鸡尾酒或配料..."
        />

        {search.trim() ? (
          searchResults.length > 0 ? (
            searchResults.map((c) => {
              const m = getCocktailMatch(c, state.ownedIngredientIds, allIngredients);
              return (
                <TouchableOpacity key={c.id} onPress={() => { setSearch(''); router.push(`/recipe/${c.id}`); }} activeOpacity={0.7}>
                  <GlassCard style={styles.searchCard}>
                    <Text style={styles.searchName}>{c.nameZh}</Text>
                    <Text style={styles.searchSub}>{c.nameEn} · {m.matchPercent}% 匹配</Text>
                  </GlassCard>
                </TouchableOpacity>
              );
            })
          ) : (
            <EmptyState
              icon="search-off"
              message="没有找到相关鸡尾酒"
              actionLabel="清除搜索"
              onAction={() => setSearch('')}
            />
          )
        ) : (
          <>
            <TouchableOpacity onPress={() => router.push('/cabinet')} activeOpacity={0.7}>
              <GlassCard style={styles.cabinetCard}>
                <View style={styles.cabinetHeader}>
                  <Text style={styles.cabinetTitle}>我的酒柜</Text>
                  <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
                </View>
                <View style={styles.cabinetStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNum}>{state.ownedIngredientIds.length}</Text>
                    <Text style={styles.statLabel}>种材料</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNum}>{canMake.length}</Text>
                    <Text style={styles.statLabel}>款可调</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${allCocktails.length > 0 ? Math.round((canMake.length / allCocktails.length) * 100) : 0}%` }]}
                  />
                </View>
                <TouchableOpacity style={styles.manageBtn} onPress={() => router.push('/cabinet')} activeOpacity={0.7}>
                  <Text style={styles.manageBtnText}>管理酒柜</Text>
                </TouchableOpacity>
              </GlassCard>
            </TouchableOpacity>

            <View style={styles.tagsRow}>
              {quickTags.map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </View>

            <SectionTitle title="现在可制作" actionText="查看全部" onAction={() => router.push('/recipes')} />
            {canMake.length === 0 ? (
              <EmptyState
                icon="local-bar"
                message="你的酒柜还不能制作鸡尾酒"
                actionLabel="去添加材料"
                onAction={() => router.push('/cabinet')}
              />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                {canMake.map((item) => (
                  <CocktailImageCard
                    key={item.cocktail.id}
                    match={item}
                    variant="horizontal"
                    onPress={() => router.push(`/recipe/${item.cocktail.id}`)}
                  />
                ))}
              </ScrollView>
            )}

            {missingOne.length > 0 && (
              <>
                <SectionTitle title="缺少 1 种配料" />
                {missingOne.map((m) => (
                  <TouchableOpacity
                    key={m.cocktail.id}
                    onPress={() => router.push(`/recipe/${m.cocktail.id}`)}
                    activeOpacity={0.7}
                  >
                    <GlassCard style={styles.missingCard}>
                      <View style={styles.missingRow}>
                        <View style={styles.missingInfo}>
                          <Text style={styles.missingName}>{m.cocktail.nameZh}</Text>
                          <Text style={styles.missingSub}>
                            缺少：{m.missingIngredients.map((i) => i.name).join('、')}
                          </Text>
                        </View>
                        <MaterialIcons name="shopping-cart" size={22} color={colors.primary} />
                      </View>
                    </GlassCard>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
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
    paddingBottom: 150,
  },
  greeting: {
    ...typography.headlineXl,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.sm,
  },
  searchName: {
    ...typography.headlineMd,
    color: colors.text,
  },
  searchSub: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginTop: 2,
  },
  cabinetCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  cabinetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cabinetTitle: {
    ...typography.headlineMd,
    color: colors.text,
  },
  cabinetStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statNum: {
    ...typography.headlineLg,
    color: colors.primary,
    marginRight: 4,
  },
  statLabel: {
    ...typography.bodyMd,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.outline,
    marginHorizontal: spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.surfaceHigh,
    borderRadius: 2,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  manageBtn: {
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  manageBtnText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  horizontalList: {
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  missingCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.sm,
  },
  missingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missingInfo: {
    flex: 1,
  },
  missingName: {
    ...typography.headlineMd,
    color: colors.text,
  },
  missingSub: {
    ...typography.labelMd,
    color: colors.primary,
    marginTop: 4,
  },
});
