import React, { createContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ownedIngredientIds as defaultOwned } from '../data/mock';

const STORAGE_KEYS = {
  owned: '@homebar_owned',
  favorites: '@homebar_favorites',
  recent: '@homebar_recent',
  made: '@homebar_made',
  shopping: '@homebar_shopping',
  flavors: '@homebar_flavors',
  alcohol: '@homebar_alcohol',
};

type AlcoholLevel = 'low' | 'medium' | 'high' | 'any';

interface AppState {
  ownedIngredientIds: string[];
  favoriteCocktailIds: string[];
  recentViewedCocktailIds: string[];
  madeCocktailIds: string[];
  shoppingListIngredientIds: string[];
  preferredFlavorTags: string[];
  preferredAlcoholLevel: AlcoholLevel;
  isLoaded: boolean;
}

type Action =
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'TOGGLE_INGREDIENT'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENT_VIEWED'; payload: string }
  | { type: 'ADD_MADE_COCKTAIL'; payload: string }
  | { type: 'ADD_TO_SHOPPING_LIST'; payload: string[] }
  | { type: 'REMOVE_FROM_SHOPPING_LIST'; payload: string }
  | { type: 'CLEAR_SHOPPING_LIST' }
  | { type: 'SET_PREFERRED_FLAVOR_TAGS'; payload: string[] }
  | { type: 'SET_PREFERRED_ALCOHOL_LEVEL'; payload: AlcoholLevel };

const initialState: AppState = {
  ownedIngredientIds: defaultOwned,
  favoriteCocktailIds: [],
  recentViewedCocktailIds: [],
  madeCocktailIds: [],
  shoppingListIngredientIds: [],
  preferredFlavorTags: [],
  preferredAlcoholLevel: 'any',
  isLoaded: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, isLoaded: true };
    case 'TOGGLE_INGREDIENT': {
      const id = action.payload;
      const owned = state.ownedIngredientIds.includes(id);
      return {
        ...state,
        ownedIngredientIds: owned
          ? state.ownedIngredientIds.filter((i) => i !== id)
          : [...state.ownedIngredientIds, id],
      };
    }
    case 'TOGGLE_FAVORITE': {
      const id = action.payload;
      const fav = state.favoriteCocktailIds.includes(id);
      return {
        ...state,
        favoriteCocktailIds: fav
          ? state.favoriteCocktailIds.filter((i) => i !== id)
          : [...state.favoriteCocktailIds, id],
      };
    }
    case 'ADD_RECENT_VIEWED': {
      const id = action.payload;
      const filtered = state.recentViewedCocktailIds.filter((i) => i !== id);
      return {
        ...state,
        recentViewedCocktailIds: [id, ...filtered].slice(0, 20),
      };
    }
    case 'ADD_MADE_COCKTAIL': {
      const id = action.payload;
      if (state.madeCocktailIds.includes(id)) return state;
      return {
        ...state,
        madeCocktailIds: [...state.madeCocktailIds, id],
      };
    }
    case 'ADD_TO_SHOPPING_LIST': {
      const ids = action.payload;
      const newIds = ids.filter((id) => !state.shoppingListIngredientIds.includes(id));
      if (newIds.length === 0) return state;
      return {
        ...state,
        shoppingListIngredientIds: [...state.shoppingListIngredientIds, ...newIds],
      };
    }
    case 'REMOVE_FROM_SHOPPING_LIST': {
      const id = action.payload;
      return {
        ...state,
        shoppingListIngredientIds: state.shoppingListIngredientIds.filter((i) => i !== id),
      };
    }
    case 'CLEAR_SHOPPING_LIST':
      return { ...state, shoppingListIngredientIds: [] };
    case 'SET_PREFERRED_FLAVOR_TAGS':
      return { ...state, preferredFlavorTags: action.payload };
    case 'SET_PREFERRED_ALCOHOL_LEVEL':
      return { ...state, preferredAlcoholLevel: action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  toggleIngredient: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentViewed: (id: string) => void;
  addMadeCocktail: (id: string) => void;
  addToShoppingList: (ingredientIds: string[]) => void;
  removeFromShoppingList: (ingredientId: string) => void;
  clearShoppingList: () => void;
  setPreferredFlavorTags: (tags: string[]) => void;
  setPreferredAlcoholLevel: (level: AlcoholLevel) => void;
  isInShoppingList: (ingredientId: string) => boolean;
  isIngredientOwned: (id: string) => boolean;
  isCocktailFavorite: (id: string) => boolean;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [owned, favorites, recent, made, shopping, flavors, alcohol] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.owned),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.recent),
          AsyncStorage.getItem(STORAGE_KEYS.made),
          AsyncStorage.getItem(STORAGE_KEYS.shopping),
          AsyncStorage.getItem(STORAGE_KEYS.flavors),
          AsyncStorage.getItem(STORAGE_KEYS.alcohol),
        ]);
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            ownedIngredientIds: owned ? JSON.parse(owned) : defaultOwned,
            favoriteCocktailIds: favorites ? JSON.parse(favorites) : [],
            recentViewedCocktailIds: recent ? JSON.parse(recent) : [],
            madeCocktailIds: made ? JSON.parse(made) : [],
            shoppingListIngredientIds: shopping ? JSON.parse(shopping) : [],
            preferredFlavorTags: flavors ? JSON.parse(flavors) : [],
            preferredAlcoholLevel: alcohol ? JSON.parse(alcohol) : 'any',
          },
        });
      } catch {
        dispatch({ type: 'LOAD_STATE', payload: {} });
      }
    })();
  }, []);

  // Save to AsyncStorage on state change (debounced)
  useEffect(() => {
    if (!state.isLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.owned, JSON.stringify(state.ownedIngredientIds)),
        AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favoriteCocktailIds)),
        AsyncStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(state.recentViewedCocktailIds)),
        AsyncStorage.setItem(STORAGE_KEYS.made, JSON.stringify(state.madeCocktailIds)),
        AsyncStorage.setItem(STORAGE_KEYS.shopping, JSON.stringify(state.shoppingListIngredientIds)),
        AsyncStorage.setItem(STORAGE_KEYS.flavors, JSON.stringify(state.preferredFlavorTags)),
        AsyncStorage.setItem(STORAGE_KEYS.alcohol, JSON.stringify(state.preferredAlcoholLevel)),
      ]);
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.ownedIngredientIds, state.favoriteCocktailIds, state.recentViewedCocktailIds, state.madeCocktailIds, state.shoppingListIngredientIds, state.preferredFlavorTags, state.preferredAlcoholLevel, state.isLoaded]);

  const toggleIngredient = (id: string) => dispatch({ type: 'TOGGLE_INGREDIENT', payload: id });
  const toggleFavorite = (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  const addRecentViewed = (id: string) => dispatch({ type: 'ADD_RECENT_VIEWED', payload: id });
  const addMadeCocktail = (id: string) => dispatch({ type: 'ADD_MADE_COCKTAIL', payload: id });
  const addToShoppingList = (ids: string[]) => dispatch({ type: 'ADD_TO_SHOPPING_LIST', payload: ids });
  const removeFromShoppingList = (id: string) => dispatch({ type: 'REMOVE_FROM_SHOPPING_LIST', payload: id });
  const clearShoppingList = () => dispatch({ type: 'CLEAR_SHOPPING_LIST' });
  const setPreferredFlavorTags = (tags: string[]) => dispatch({ type: 'SET_PREFERRED_FLAVOR_TAGS', payload: tags });
  const setPreferredAlcoholLevel = (level: AlcoholLevel) => dispatch({ type: 'SET_PREFERRED_ALCOHOL_LEVEL', payload: level });
  const isInShoppingList = (id: string) => state.shoppingListIngredientIds.includes(id);
  const isIngredientOwned = (id: string) => state.ownedIngredientIds.includes(id);
  const isCocktailFavorite = (id: string) => state.favoriteCocktailIds.includes(id);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        toggleIngredient,
        toggleFavorite,
        addRecentViewed,
        addMadeCocktail,
        addToShoppingList,
        removeFromShoppingList,
        clearShoppingList,
        setPreferredFlavorTags,
        setPreferredAlcoholLevel,
        isInShoppingList,
        isIngredientOwned,
        isCocktailFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
