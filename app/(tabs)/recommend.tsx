import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { cocktails, ingredients } from '../../data/mock';
import { getCocktailMatch } from '../../utils/match';
import { useApp } from '../../hooks/useApp';
import AppHeader from '../../components/AppHeader';
import GlassCard from '../../components/GlassCard';
import TagChip from '../../components/TagChip';
import EmptyState from '../../components/EmptyState';

const tabs = [
  { key: 'canMake', label: '现在能做' },
  { key: 'missingOne', label: '只差 1 种' },
  { key: 'missingTwo', label: '只差 2 种' },
];

const emptyMessages: Record<string, { message: string; icon: string }> = {
  canMake: { message: '再添加几种材料，就能开始调酒', icon: 'local-bar' },
  missingOne: { message: '暂时没有只差 1 种材料的酒谱', icon: 'search' },
  missingTwo: { message: '暂时没有只差 2 种材料的酒谱', icon: 'search' },
};

export default function RecommendScreen() {
  const router = useRouter();
  const { state, addToShoppingList } = useApp();
  const [activeTab, setActiveTab] = useState('canMake');

  const matches = useMemo(
    () => cocktails.map((c) => getCocktailMatch(c, state.ownedIngredientIds)),
    [state.ownedIngredientIds]
  );

  const filtered = useMemo(() => {
    if (activeTab === 'canMake') return matches.filter((m) => m.status === 'canMake');
    if (activeTab === 'missingOne') return matches.filter((m) => m.status === 'missingOne');
    return matches.filter((m) => m.status === 'missingTwo');
  }, [activeTab, matches]);

  const suggestions = useMemo(() => {
    const missingMap: Record<string, { count: number; id: string }> = {};
    matches
      .filter((m) => m.status === 'missingOne')
      .forEach((m) => {
        m.missingIngredients.forEach((ing) => {
          if (!missingMap[ing.id]) missingMap[ing.id] = { count: 0, id: ing.id };
          missingMap[ing.id].count++;
        });
      });
    return Object.values(missingMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(({ id, count }) => {
        const ing = ingredients.find((i) => i.id === id);
        return { id, name: ing?.name || id, count };
      });
  }, [matches]);

  const canMakeCount = matches.filter((m) => m.status === 'canMake').length;

  const handleSuggestionPress = (id: string, name: string) => {
    addToShoppingList([id]);
    Alert.alert('已加入补货清单', `「${name}」已加入补货清单`, [
      { text: '继续浏览', style: 'cancel' },
      { text: '查看清单', onPress: () => router.push('/shopping-list') },
    ]);
  };

  return (
    <View style={styles.root}>
      <AppHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>
          现在可制作{' '}
          <Text style={styles.highlight}>{canMakeCount}</Text>
          {' '}款鸡尾酒
        </Text>
        <Text style={styles.subtitle}>
          你的酒柜有 {state.ownedIngredientIds.length} 种材料
        </Text>

        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TagChip
              key={tab.key}
              label={tab.label}
              active={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
            />
          ))}
        </View>

        {filtered.length === 0 ? (
          <EmptyState
            icon={emptyMessages[activeTab]?.icon || 'local-bar'}
            message={emptyMessages[activeTab]?.message || '暂无匹配的鸡尾酒'}
          />
        ) : (
          filtered.map((item) => (
            <TouchableOpacity key={item.cocktail.id} onPress={() => router.push(`/recipe/${item.cocktail.id}`)} activeOpacity={0.7}>
              <GlassCard style={styles.cocktailCard}>
                <View style={styles.cardRow}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cocktailName}>{item.cocktail.nameZh}</Text>
                    <Text style={styles.cocktailSub}>{item.cocktail.nameEn}</Text>
                    <View style={styles.tagRow}>
                      {item.cocktail.tags.slice(0, 3).map((t) => (
                        <Text key={t} style={styles.tag}>{t}</Text>
                      ))}
                    </View>
                    {item.status !== 'canMake' && (
                      <View style={styles.missingInfo}>
                        <MaterialIcons name="info-outline" size={14} color={colors.primary} />
                        <Text style={styles.missingText}>
                          缺少 {item.missingIngredients.map((i) => i.name).join('、')}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.matchCircle}>
                    <Text style={styles.matchPercent}>{item.matchPercent}%</Text>
                    {item.status === 'canMake' && (
                      <MaterialIcons name="check-circle" size={16} color={colors.success} style={{ marginTop: 4 }} />
                    )}
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))
        )}

        {suggestions.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>补货建议</Text>
              <TouchableOpacity onPress={() => router.push('/shopping-list')} activeOpacity={0.7}>
                <Text style={styles.sectionAction}>查看清单</Text>
              </TouchableOpacity>
            </View>
            {suggestions.map((s) => (
              <TouchableOpacity key={s.id} onPress={() => handleSuggestionPress(s.id, s.name)} activeOpacity={0.7}>
                <GlassCard style={styles.suggestCard}>
                  <View style={styles.suggestRow}>
                    <MaterialIcons name="add-shopping-cart" size={20} color={colors.primary} />
                    <Text style={styles.suggestText}>
                      买 <Text style={styles.highlight}>{s.name}</Text>，可多做 {s.count} 款
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color={colors.outlineLight} />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
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
    paddingBottom: 100,
  },
  title: {
    ...typography.headlineXl,
    color: colors.text,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.sm,
  },
  highlight: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textMuted,
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.pageMargin,
    marginBottom: spacing.lg,
  },
  cocktailCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cocktailName: {
    ...typography.headlineMd,
    color: colors.text,
  },
  cocktailSub: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: 2,
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
  missingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  missingText: {
    ...typography.labelMd,
    color: colors.primary,
    marginLeft: 6,
  },
  matchCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  matchPercent: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.text,
  },
  sectionAction: {
    ...typography.labelLg,
    color: colors.primary,
  },
  suggestCard: {
    marginHorizontal: spacing.pageMargin,
    marginBottom: spacing.sm,
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestText: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
