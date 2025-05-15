"use client";

import { NutritionData } from "../types/nutrition";

// Helper function to format serving size with units in parentheses
const formatServingSize = (servingSize: string | number): string => {
  // If it's already a string with formatting, return as is
  if (typeof servingSize === 'string' && servingSize.includes('(')) {
    return servingSize;
  }
  
  // Otherwise, add a default unit (g) in parentheses
  return `${servingSize} (${typeof servingSize === 'number' ? servingSize : '0'}g)`;
};

// Helper function to round nutrient values according to FDA rules
const roundNutrientValue = (value: number): string => {
  if (value < 0.5) return '0';
  if (value <= 5) return value.toFixed(1);
  return Math.round(value).toString();
};

// Helper function to determine which nutrients are insignificant
const getInsignificantNutrients = (data: NutritionData): string[] => {
  const insignificantNutrients: string[] = [];
  
  // Check each nutrient and add to the list if it's insignificant
  if (data.transFat < 0.5) insignificantNutrients.push('trans fat');
  if (data.cholesterol < 2) insignificantNutrients.push('cholesterol');
  if (data.dietaryFiber < 1) insignificantNutrients.push('dietary fiber');
  if (data.sugars < 1) insignificantNutrients.push('total sugars');
  if (data.addedSugars < 1) insignificantNutrients.push('added sugars');
  if (data.vitaminD < 2) insignificantNutrients.push('vitamin D');
  if (data.calcium < 20) insignificantNutrients.push('calcium');
  if (data.iron < 0.36) insignificantNutrients.push('iron');
  if (data.potassium < 140) insignificantNutrients.push('potassium');
  
  return insignificantNutrients;
};

export function USSimplifiedLabel({ data }: { data: NutritionData }) {
  // The simplified format is used when a food contains insignificant amounts of seven or more
  // of the mandatory nutrients. FDA regulations in 21 CFR 101.9(f) specify that a nutrient
  // is present in an insignificant amount if it may be declared as zero according to 101.9(c)
  
  return (
    <div 
      className="w-[400px] bg-white border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        padding: '0.5rem 1rem',
        boxSizing: 'border-box',
      }}
    >
      <div className="text-4xl font-black tracking-tighter border-b-8 border-black pb-1">
        Nutrition Facts
      </div>
      <div className="text-base border-b border-black py-1">
        {data.servingsPerContainer} servings per container
      </div>
      <div className="flex justify-between border-b-8 border-black py-1">
        <div className="text-base font-black">Serving size</div>
        <div className="text-base font-black">{formatServingSize(data.servingSize)}</div>
      </div>

      <div className="text-sm py-1">Amount per serving</div>
      <div className="flex justify-between text-3xl font-black border-b-4 border-black py-1">
        <div>Calories</div>
        <div>{Math.round(data.calories)}</div>
      </div>

      <div className="text-right text-sm border-b border-black py-1">% DV*</div>

      {/* Only showing significant nutrients */}
      <div className="flex justify-between text-base font-bold border-b border-black py-1">
        <div>Total Fat {roundNutrientValue(data.totalFat)}g</div>
        <div>{Math.round((data.totalFat / 78) * 100)}%</div>
      </div>
      
      <div className="flex justify-between text-base border-b border-black py-1 pl-6">
        <div>Saturated Fat {roundNutrientValue(data.saturatedFat)}g</div>
        <div>{Math.round((data.saturatedFat / 20) * 100)}%</div>
      </div>
      
      {data.transFat > 0 && (
        <div className="flex justify-between text-base border-b border-black py-1 pl-6">
          <div><span className="italic">Trans </span>Fat {roundNutrientValue(data.transFat)}g</div>
          <div></div>
        </div>
      )}
      
      {data.polyunsaturatedFat > 0 && (
        <div className="flex justify-between text-base border-b border-black py-1 pl-6">
          <div>Polyunsaturated Fat {roundNutrientValue(data.polyunsaturatedFat)}g</div>
          <div></div>
        </div>
      )}
      
      {data.monounsaturatedFat > 0 && (
        <div className="flex justify-between text-base border-b border-black py-1 pl-6">
          <div>Monounsaturated Fat {roundNutrientValue(data.monounsaturatedFat)}g</div>
          <div></div>
        </div>
      )}

      {data.cholesterol > 0 && (
        <div className="flex justify-between text-base font-bold border-b border-black py-1">
          <div>Cholesterol {roundNutrientValue(data.cholesterol)}mg</div>
          <div>{Math.round((data.cholesterol / 300) * 100)}%</div>
        </div>
      )}
      
      <div className="flex justify-between text-base font-bold border-b border-black py-1">
        <div>Sodium {roundNutrientValue(data.sodium)}mg</div>
        <div>{Math.round((data.sodium / 2300) * 100)}%</div>
      </div>
      
      <div className="flex justify-between text-base font-bold border-b border-black py-1">
        <div>Total Carbohydrate {roundNutrientValue(data.totalCarbohydrates)}g</div>
        <div>{Math.round((data.totalCarbohydrates / 275) * 100)}%</div>
      </div>
      
      <div className="flex justify-between text-base font-bold border-b border-black py-1">
        <div>Protein {roundNutrientValue(data.protein)}g</div>
        <div></div>
      </div>

      {/* Statement about insignificant nutrients */}
      <div className="text-sm py-2 border-b-8 border-black">
        Not a significant source of {getInsignificantNutrients(data).join(', ')}.
      </div>

      <div className="text-sm py-2">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
}
