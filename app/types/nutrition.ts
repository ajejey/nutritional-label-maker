export type NutritionData = {
  servingSize: string | number;
  servingsPerContainer: string | number;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  polyunsaturatedFat: number;
  monounsaturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrates: number;
  dietaryFiber: number;
  sugars: number;
  addedSugars: number;
  protein: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
};

export type LabelFormat = 'US' | 'EU' | 'INDIAN' | 'CANADA' | 'AUSTRALIA' | 'US_DUAL_COLUMN' | 'US_TABULAR' | 'US_LINEAR' | 'US_SIMPLIFIED' | 'US_BILINGUAL' | 'US_VERTICAL_CONDENSED';