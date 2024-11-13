export type NutritionData = {
  servingSize: string;
  servingsPerContainer: string;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrates: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
};

export type LabelFormat = 'US' | 'EU' | 'INDIAN' | 'CANADA';