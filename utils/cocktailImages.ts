import { ImageSourcePropType } from 'react-native';

const cocktailImages: Record<string, ImageSourcePropType> = {
  'mojito': require('../assets/cocktails/mojito.jpg'),
  'gin-tonic': require('../assets/cocktails/gin-tonic.jpg'),
  'margarita': require('../assets/cocktails/margarita.jpg'),
  'whiskey-sour': require('../assets/cocktails/whiskey-sour.jpg'),
  'tom-collins': require('../assets/cocktails/tom-collins.jpg'),
  'daiquiri': require('../assets/cocktails/daiquiri.jpg'),
  'cuba-libre': require('../assets/cocktails/cuba-libre.jpg'),
  'vodka-tonic': require('../assets/cocktails/vodka-tonic.jpg'),
};

const fallbackImage: ImageSourcePropType = require('../assets/cocktails/fallback.jpg');

export function getCocktailImageSource(cocktailId: string): ImageSourcePropType {
  return cocktailImages[cocktailId] ?? fallbackImage;
}
