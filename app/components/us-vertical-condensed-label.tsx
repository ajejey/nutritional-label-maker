"use client";

import { NutritionData } from "../types/nutrition";

// Vertical condensed format follows FDA regulations in 21 CFR 101.9(j)(13)(ii)(A)(1)
// Used when the package shape or size cannot accommodate the standard vertical format
// All required nutrients must still be included, but with more compact presentation

export function USVerticalCondensedLabel({ data }: { data: NutritionData }) {
  return (
    <div 
      className="w-[400px] bg-white p-4 border border-black font-bold text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-4xl font-black tracking-tighter border-b-8 border-black pb-1 mb-1">
        Nutrition Facts
      </div>
      <div className="text-base border-b border-black py-1">
        {data.servingsPerContainer} servings per container
      </div>
      <div className="flex justify-between border-b-8 border-black py-1">
        <div className="text-base font-bold">Serving size</div>
        <div className="text-base font-bold">{typeof data.servingSize === 'string' ? data.servingSize : `${data.servingSize}g`}</div>
      </div>

      <div className="text-sm py-1">Amount per serving</div>
      <div className="flex justify-between text-3xl font-black border-b-4 border-black py-1">
        <div>Calories</div>
        <div>{Math.round(data.calories)}</div>
      </div>

      <div className="text-right text-sm border-b border-black py-1">% Daily Value*</div>

      {/* Helper function for rounding values according to FDA rules */}
      {(() => {
        const roundNutrientValue = (value: number, unit: string) => {
          if (unit === 'g') {
            if (value < 0.5) return value.toFixed(1);
            return Math.round(value);
          }
          if (unit === 'mg') {
            if (value < 5) return Math.round(value);
            if (value < 50) return Math.round(value / 5) * 5;
            return Math.round(value / 10) * 10;
          }
          if (unit === 'mcg') {
            if (value < 10) return Math.round(value);
            if (value < 50) return Math.round(value / 5) * 5;
            return Math.round(value / 10) * 10;
          }
          return Math.round(value);
        };
        
        return (
          <>
            {/* Nutrient rows in condensed format */}
            {[
              { label: "Total Fat", value: data.totalFat, unit: "g", dv: 78 },
              { label: "Sat. Fat", value: data.saturatedFat, unit: "g", dv: 20, indent: true },
              { label: "Trans Fat", value: data.transFat, unit: "g", indent: true },
              { label: "Cholest.", value: data.cholesterol, unit: "mg", dv: 300 },
              { label: "Sodium", value: data.sodium, unit: "mg", dv: 2300 },
              { label: "Total Carb.", value: data.totalCarbohydrates, unit: "g", dv: 275 },
              { label: "Fiber", value: data.dietaryFiber, unit: "g", dv: 28, indent: true },
              { label: "Total Sugars", value: data.sugars, unit: "g", indent: true },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex justify-between text-sm border-b border-black py-[2px] ${
                  item.indent ? "pl-4" : "font-bold"
                }`}
              >
                <div>
                  {item.label} {roundNutrientValue(item.value, item.unit)}{item.unit}
                </div>
                {item.dv && <div>{Math.round((item.value / item.dv) * 100)}%</div>}
              </div>
            ))}
            
            {/* Added Sugars line with indent */}
            {data.addedSugars > 0 && (
              <div className="flex justify-between text-sm border-b border-black py-[2px] pl-8">
                <div>Includes {roundNutrientValue(data.addedSugars, 'g')}g Added Sugars</div>
                <div>{Math.round((data.addedSugars / 50) * 100)}%</div>
              </div>
            )}
            
            {/* Protein line */}
            <div className="flex justify-between text-sm border-b border-black py-[2px] font-bold">
              <div>Protein {roundNutrientValue(data.protein, 'g')}g</div>
              {data.protein >= 1 && <div>{Math.round((data.protein / 50) * 100)}%</div>}
            </div>
          </>
        );
      })()}

      {/* Vitamins and Minerals in condensed format with bullet separators */}
      <div className="border-b-8 border-black py-2">
        <div className="flex flex-wrap text-sm">
          <div className="flex items-center mr-2">
            <span>Vit. D {data.vitaminD}mcg {Math.round((data.vitaminD / 20) * 100)}%</span>
          </div>
          <div className="flex items-center mx-2">
            <span className="px-1">•</span>
            <span>Calcium {data.calcium}mg {Math.round((data.calcium / 1300) * 100)}%</span>
          </div>
        </div>
        <div className="flex flex-wrap text-sm">
          <div className="flex items-center mr-2">
            <span>Iron {data.iron}mg {Math.round((data.iron / 18) * 100)}%</span>
          </div>
          <div className="flex items-center mx-2">
            <span className="px-1">•</span>
            <span>Potas. {data.potassium}mg {Math.round((data.potassium / 4700) * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="py-2 text-xs leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food
        contributes to a daily diet. 2,000 calories a day is used for general
        nutrition advice.
      </div>
    </div>
  );
}
