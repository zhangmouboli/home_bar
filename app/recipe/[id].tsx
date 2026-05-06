import React, { useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { cocktails, ingredients } from '../../data/mock';
import { getCocktailMatch } from '../../utils/match';
import { getCocktailImageSource } from '../../utils/images';
import { useApp } from '../../hooks/useApp';
import GlassCard from '../../components/GlassCard';
import TagChip from '../../components/TagChip';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, toggleFavorite, isCocktailFavorite, addRecentViewed, addToShoppingList, isIngredientOwned, isInShoppingList } = useApp();

  const cocktail = useMemo(() => cocktails.find((c) => c.id === id), [id]);
  const match = useMemo(
    () => (cocktail ? getCocktailMatch(cocktail, state.ownedIngredientIds) : null),
    [cocktail, state.ownedIngredientIds]
  );

  useEffect(() => {
    if (id) addRecentViewed(id);
  }, [id]);

  if (!cocktail || !match) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>未找到该酒谱</Text>
        </View>
      </View>
    );
  }

  const isFav = isCocktailFavorite(cocktail.id);
  const missingCount = match.missingCount;
  const canMake = missingCount === 0;
  const imageSource = getCocktailImageSource(cocktail.id);

  const handleAddSingle = (ingredientId: string, ingredientName: string) => {
    if (isInShoppingList(ingredientId)) {
      Alert.alert('补货清单', `${ingredientName} 已在补货清单中`);
      return;
    }
    addToShoppingList([ingredientId]);
    Alert.alert('补货清单', `已加入补货清单：${ingredientName}`);
  };

  const handleMake = () => {
    if (canMake) {
      router.push(`/make/${cocktail.id}`);
    } else {
      const missingIds = match.missingIngredients.map((i) => i.id);
      addToShoppingList(missingIds);
      Alert.alert(
        '已加入补货清单',
        `${match.missingIngredients.map((i) => i.name).join('、')}已加入补货清单`,
        [
          { text: '继续浏览', style: 'cancel' },
          { text: '查看清单', onPress: () => router.push('/shopping-list') },
        ]
      );
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.imageWrap}>
          <Image source={imageSource} style={styles.heroImage} />
          <View style={[styles.imageOverlay, { paddingTop: insets.top + spacing.sm }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <MaterialIcons name="share" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameZh}>{cocktail.nameZh}</Text>
              <Text style={styles.nameEn}>{cocktail.nameEn}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(cocktail.id)}>
              <MaterialIcons name={isFav ? 'favorite' : 'favorite-border'} size={28} color={isFav ? colors.primary : colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.tagRow}>
            {cocktail.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
          </View>

          <GlassCard style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <MaterialIcons name="speed" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>难度</Text>
                <Text style={styles.infoValue}>{cocktail.difficulty}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <MaterialIcons name="timer" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>用时</Text>
                <Text style={styles.infoValue}>{cocktail.timeMinutes} 分钟</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <MaterialIcons name="local-bar" size={20} color={colors.primary} />
                <Text style={styles.infoLabel}>酒精度</Text>
                <Text style={styles.infoValue}>{cocktail.alcoholLevel}</Text>
              </View>
            </View>
          </GlassCard>

          <Text style={styles.sectionTitle}>所需材料</Text>
          {cocktail.ingredients.map((ci) => {
            const ing = ingredients.find((i) => i.id === ci.ingredientId);
            const owned = isIngredientOwned(ci.ingredientId);
            return (
              <View key={ci.ingredientId} style={styles.ingredientRow}>
                <MaterialIcons
                  name={owned ? 'check-circle' : 'radio-button-unchecked'}
                  size={22}
                  color={owned ? colors.success : colors.outline}
                />
                <Text style={[styles.ingredientName, !owned && styles.ingredientMissing]}>
                  {ing?.name || ci.ingredientId}
                </Text>
                <Text style={styles.ingredientAmount}>{ci.amount}</Text>
                {!owned && (
                  <TouchableOpacity
                    style={styles.buyIcon}
                    onPress={() => handleAddSingle(ci.ingredientId, ing?.name || ci.ingredientId)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <MaterialIcons
                      name={isInShoppingList(ci.ingredientId) ? 'check-circle' : 'add-shopping-cart'}
                      size={22}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <Text style={styles.sectionTitle}>所需工具</Text>
          <View style={styles.toolsRow}>
            {cocktail.tools.map((t) => (
              <View key={t} style={styles.toolChip}>
                <MaterialIcons name="build" size={16} color={colors.textMuted} />
                <Text style={styles.toolText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>制作步骤</Text>
          {cocktail.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}

          {cocktail.tip && (
            <>
              <Text style={styles.sectionTitle}>小贴士</Text>
              <GlassCard style={styles.tipCard}>
                <View style={styles.tipRow}>
                  <MaterialIcons name="lightbulb" size={20} color={colors.primary} />
                  <Text style={styles.tipText}>{cocktail.tip}</Text>
                </View>
              </GlassCard>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + spacing.pageMargin }]}>
        <TouchableOpacity style={[styles.startBtn, !canMake && styles.startBtnDisabled]} onPress={handleMake}>
          <MaterialIcons name={canMake ? 'play-arrow' : 'add-shopping-cart'} size={22} color={canMake ? colors.background : colors.primary} />
          <Text style={[styles.startBtnText, !canMake && styles.startBtnTextOutline]}>{canMake ? '开始制作' : '加入补货清单'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(cocktail.id)}>
          <MaterialIcons name={isFav ? 'favorite' : 'favorite-border'} size={24} color={colors.primary} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.pageMargin,
    paddingBottom: spacing.md,
  },
  imageWrap: {
    width: '100%',
    height: 340,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.pageMargin,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.pageMargin,
    paddingTop: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  nameZh: {
    ...typography.headlineXl,
    color: colors.text,
  },
  nameEn: {
    ...typography.bodyMd,
    color: colors.textMuted,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.labelSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  infoValue: {
    ...typography.labelLg,
    color: colors.text,
    marginTop: 2,
  },
  infoDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  ingredientName: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  ingredientMissing: {
    color: colors.textMuted,
  },
  ingredientAmount: {
    ...typography.labelMd,
    color: colors.textMuted,
  },
  buyIcon: {
    marginLeft: spacing.sm,
  },
  toolsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  stepNumText: {
    ...typography.labelMd,
    color: colors.background,
    fontWeight: '700',
  },
  stepText: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  tipCard: {
    marginBottom: spacing.lg,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    ...typography.bodyMd,
    color: colors.textMuted,
    flex: 1,
    marginLeft: spacing.sm,
    lineHeight: 22,
  },
  bottomCta: {
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
  startBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.md,
  },
  startBtnDisabled: {
    backgroundColor: 'rgba(242, 202, 80, 0.08)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  startBtnText: {
    ...typography.labelLg,
    color: colors.background,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  startBtnTextOutline: {
    color: colors.primary,
  },
  favBtn: {
    width: 52,
    height: 52,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: 'rgba(242, 202, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
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
});
