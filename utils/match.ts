import { Cocktail, CocktailMatch, Ingredient } from '../types';
import { colors } from '../theme/colors';

export function getCocktailMatch(
  cocktail: Cocktail,
  ownedIds: string[],
  allIngredients: Ingredient[]
): CocktailMatch {
  const totalRequired = cocktail.ingredients.length;
  const ownedCount = cocktail.ingredients.filter((ci) =>
    ownedIds.includes(ci.ingredientId)
  ).length;
  const missingIngredients = cocktail.ingredients
    .filter((ci) => !ownedIds.includes(ci.ingredientId))
    .map((ci) => allIngredients.find((i) => i.id === ci.ingredientId))
    .filter((i): i is Ingredient => i !== undefined);
  const missingCount = totalRequired - ownedCount;
  const matchPercent = totalRequired > 0 ? Math.round((ownedCount / totalRequired) * 100) : 0;

  let status: CocktailMatch['status'];
  if (missingCount === 0) status = 'canMake';
  else if (missingCount === 1) status = 'missingOne';
  else if (missingCount === 2) status = 'missingTwo';
  else status = 'moreMissing';

  return {
    cocktail,
    totalRequired,
    ownedCount,
    missingIngredients,
    missingCount,
    matchPercent,
    status,
  };
}

export function getMatchStatus(status: CocktailMatch['status']): {
  label: string;
  color: string;
} {
  switch (status) {
    case 'canMake':
      return { label: '配料齐全', color: colors.success };
    case 'missingOne':
      return { label: '缺 1 种', color: colors.primary };
    case 'missingTwo':
      return { label: '缺 2 种', color: colors.primary };
    case 'moreMissing':
      return { label: '缺少多种', color: colors.outline };
  }
}
