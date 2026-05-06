export interface Ingredient {
  id: string;
  name: string;
  nameEn?: string;
  category: IngredientCategory;
  icon?: string;
}

export type IngredientCategory =
  | 'base'
  | 'liqueur'
  | 'juice'
  | 'syrup'
  | 'mixer'
  | 'bitter'
  | 'garnish'
  | 'other';

export interface CocktailIngredient {
  ingredientId: string;
  amount: string;
}

export interface Cocktail {
  id: string;
  nameZh: string;
  nameEn: string;
  subtitle: string;
  image?: string;
  tags: string[];
  difficulty: string;
  timeMinutes: number;
  alcoholLevel: string;
  ingredients: CocktailIngredient[];
  steps: string[];
  tools: string[];
  tip?: string;
}

export interface CocktailMatch {
  cocktail: Cocktail;
  totalRequired: number;
  ownedCount: number;
  missingIngredients: Ingredient[];
  missingCount: number;
  matchPercent: number;
  status: 'canMake' | 'missingOne' | 'missingTwo' | 'moreMissing';
}
