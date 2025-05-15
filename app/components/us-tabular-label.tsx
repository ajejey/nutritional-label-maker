"use client";

import { NutritionData } from "../types/nutrition";

// Tabular format is specified under FDA regulations 21 CFR 101.9(d)(11)(iii)
// for packages with insufficient vertical space for the standard vertical format

export function USTabularLabel({ data }: { data: NutritionData }) {
  // Helper functions for rounding and formatting
  const roundNutrientValue = (value: number, unit: string) => {
    if (unit === 'g') {
      return value < 1 ? value.toFixed(1) : Math.round(value);
    } else if (unit === 'mg') {
      return value < 50 ? value.toFixed(1) : Math.round(value);
    } else if (unit === 'mcg') {
      return value < 10 ? value.toFixed(1) : Math.round(value);
    }
    return Math.round(value);
  };

  const getDV = (value: number, dailyValue: number) => {
    return Math.round((value / dailyValue) * 100);
  };

  const formatServingSize = (size: string | number | undefined) => {
    return size || 'N/A';
  };

  return (
    <div 
      className="w-[1000px] bg-white border-2 border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '8pt',
        WebkitFontSmoothing: 'antialiased',
        lineHeight: '1.2',
      }}
    >
      <div className="flex">
        {/* Left column - Title, servings, calories (flex-1) */}
        <div className="w-1/6 border-r-2 border-black">
          <div className="text-lg font-black px-1  leading-none">Nutrition Facts</div>
          <div className="px-1">
            <div className="text-xs text-[6pt]">{data.servingsPerContainer} servings per container</div>
            <div className="font-bold text-xs">Serving size</div>
            <div className="text-xs leading-none">{formatServingSize(data.servingSize)}</div>
          </div>
          <div className="flex justify-between border-t-2 border-black p-1">
            <div>
            <div className="font-bold text-[8pt]">Calories</div>
            <div className="text-[6pt]">per serving</div>
            </div>
            <div className="text-[16pt] font-bold leading-none">{Math.round(data.calories)}</div>
          </div>
        </div>
        
        {/* Middle column - Nutrients (flex-3) */}
        <div className="w-2/3">
          {/* Nutrient headers */}
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="py-0.5 px-1 border-r border-black">
              <div className="flex justify-between font-bold text-xs">
                <div>Amount/serving</div>
                <div>% Daily Value*</div>
              </div>
            </div>
            <div className="py-0.5 px-1">
              <div className="flex justify-between font-bold text-xs">
                <div>Amount/serving</div>
                <div>% Daily Value*</div>
              </div>
            </div>
          </div>

          {/* Nutrient rows */}
          <div className="grid grid-cols-2">
            {/* Left nutrients column */}
            <div className="border-r border-black">
              {/* Total Fat */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="font-bold">Total Fat {roundNutrientValue(data.totalFat, 'g')}g</div>
                <div>{getDV(data.totalFat, 78)}%</div>
              </div>
              {/* Saturated Fat */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="pl-4">Saturated Fat {roundNutrientValue(data.saturatedFat, 'g')}g</div>
                <div>{getDV(data.saturatedFat, 20)}%</div>
              </div>
              {/* Trans Fat */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="pl-4">Trans Fat {roundNutrientValue(data.transFat, 'g')}g</div>
                <div></div>
              </div>
              {/* Cholesterol */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="font-bold">Cholesterol {roundNutrientValue(data.cholesterol, 'mg')}mg</div>
                <div>{getDV(data.cholesterol, 300)}%</div>
              </div>
              {/* Sodium */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="font-bold">Sodium {roundNutrientValue(data.sodium, 'mg')}mg</div>
                <div>{getDV(data.sodium, 2300)}%</div>
              </div>
            </div>

            {/* Right nutrients column */}
            <div>
              {/* Total Carbohydrate */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="font-bold">Total Carbohydrate {roundNutrientValue(data.totalCarbohydrates, 'g')}g</div>
                <div>{getDV(data.totalCarbohydrates, 275)}%</div>
              </div>
              {/* Dietary Fiber */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="pl-4">Dietary Fiber {roundNutrientValue(data.dietaryFiber, 'g')}g</div>
                <div>{getDV(data.dietaryFiber, 28)}%</div>
              </div>
              {/* Total Sugars */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="pl-4">Total Sugars {roundNutrientValue(data.sugars, 'g')}g</div>
                <div></div>
              </div>
              {/* Added Sugars */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="pl-8 whitespace-nowrap">Includes {roundNutrientValue(data.addedSugars, 'g')}g Added Sugars</div>
                <div>{getDV(data.addedSugars, 50)}%</div>
              </div>
              {/* Protein */}
              <div className="flex justify-between py-0.5 px-1 border-b border-black">
                <div className="font-bold">Protein {roundNutrientValue(data.protein, 'g')}g</div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Vitamins and Minerals */}
          <div className="py-0.5 px-1 border-b border-black text-[7pt]">
            <div className="flex flex-wrap">
              <span>Vitamin D {roundNutrientValue(data.vitaminD, 'mcg')}mcg {getDV(data.vitaminD, 20)}%</span>
              <span className="mx-1">•</span>
              <span>Calcium {roundNutrientValue(data.calcium, 'mg')}mg {getDV(data.calcium, 1300)}%</span>
              <span className="mx-1">•</span>
              <span>Iron {roundNutrientValue(data.iron, 'mg')}mg {getDV(data.iron, 18)}%</span>
              <span className="mx-1">•</span>
              <span>Potassium {roundNutrientValue(data.potassium, 'mg')}mg {getDV(data.potassium, 4700)}%</span>
            </div>
          </div>
        </div>

        {/* Right column - Footnote (flex-1) */}
        <div className="w-1/6 py-0.5 px-1 text-[6pt] leading-tight">
          *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </div>
      </div>
    </div>
  );
}

