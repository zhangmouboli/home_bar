import React, { createContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ownedIngredientIds as defaultOwned } from '../data/mock';

const STORAGE_KEYS = {
  owned: '@homebar_owned',
  favorites: '@homebar_favorites',
  recent: '@homebar_recent',
  made: '@homebar_made',
};

interface AppState {
  ownedIngredientIds: string[];
  favoriteCocktailIds: string[];
  recentViewedCocktailIds: string[];
  madeCocktailIds: string[];
  isLoaded: boolean;
}

type Action =
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'TOGGLE_INGREDIENT'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENT_VIEWED'; payload: string }
  | { type: 'ADD_MADE_COCKTAIL'; payload: string };

const initialState: AppState = {
  ownedIngredientIds: defaultOwned,
  favoriteCocktailIds: [],
  recentViewedCocktailIds: [],
  madeCocktailIds: [],
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
        const [owned, favorites, recent, made] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.owned),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.recent),
          AsyncStorage.getItem(STORAGE_KEYS.made),
        ]);
        dispatch({
          type: 'LOAD_STATE',
          payload: {
            ownedIngredientIds: owned ? JSON.parse(owned) : defaultOwned,
            favoriteCocktailIds: favorites ? JSON.parse(favorites) : [],
            recentViewedCocktailIds: recent ? JSON.parse(recent) : [],
            madeCocktailIds: made ? JSON.parse(made) : [],
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
      ]);
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.ownedIngredientIds, state.favoriteCocktailIds, state.recentViewedCocktailIds, state.madeCocktailIds, state.isLoaded]);

  const toggleIngredient = (id: string) => dispatch({ type: 'TOGGLE_INGREDIENT', payload: id });
  const toggleFavorite = (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  const addRecentViewed = (id: string) => dispatch({ type: 'ADD_RECENT_VIEWED', payload: id });
  const addMadeCocktail = (id: string) => dispatch({ type: 'ADD_MADE_COCKTAIL', payload: id });
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
        isIngredientOwned,
        isCocktailFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
