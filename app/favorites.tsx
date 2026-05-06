import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { cocktails } from '../data/mock';
import { getCocktailMatch } from '../utils/match';
import { useApp } from '../hooks/useApp';
import AppHeader from '../components/AppHeader';
import CocktailListItem from '../components/CocktailListItem';
import EmptyState from '../components/EmptyState';

export default function FavoritesScreen() {
  const router = useRouter();
  const { state, toggleFavorite, isCocktailFavorite } = useApp();

  const favorites = useMemo(() => {
    return state.favoriteCocktailIds
      .map((id) => cocktails.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [state.favoriteCocktailIds]);

  const matches = useMemo(
    () => cocktails.map((c) => getCocktailMatch(c, state.ownedIngredientIds)),
    [state.ownedIngredientIds]
  );

  return (
    <View style={styles.root}>
      <AppHeader showBack fallbackRoute="/profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>我的收藏</Text>
        <Text style={styles.subtitle}>{favorites.length} 款酒谱</Text>

        {favorites.length === 0 ? (
          <EmptyState
            icon="favorite-border"
            message="还没有收藏的酒谱"
            actionLabel="去酒谱库看看"
            onAction={() => router.push('/recipes')}
          />
        ) : (
          favorites.map((cocktail) => {
            const match = matches.find((m) => m.cocktail.id === cocktail.id);
            return (
              <CocktailListItem
                key={cocktail.id}
                cocktail={cocktail}
                match={match}
                isFavorite={isCocktailFavorite(cocktail.id)}
                onToggleFavorite={() => toggleFavorite(cocktail.id)}
                onPress={() => router.push(`/recipe/${cocktail.id}`)}
              />
            );
          })
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
});
