"use client";

import { NutritionData } from "../types/nutrition";

// Standard Vertical Format follows FDA regulations in 21 CFR 101.9
// This is the default format required for most packaged foods

export function USNutritionLabel({ data }: { data: NutritionData }) {
  // Helper function for rounding values according to FDA rules
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
    <div 
      className="w-[400px] bg-white p-4 border border-black font-bold text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-5xl font-black tracking-tighter border-b-8 border-black pb-1 mb-1">
        Nutrition Facts
      </div>
      <div className="text-base border-b border-black pb-1 mb-1">
        {data.servingsPerContainer} servings per container
      </div>
      <div className="flex justify-between border-b-8 border-black pb-1 mb-1">
        <div className="text-xl font-black">Serving size</div>
        <div className="text-xl font-black">{data.servingSize}</div>
      </div>

      <div className="text-base font-black">Amount per serving</div>
      <div className="flex justify-between text-5xl font-black border-b-8 border-black mb-1">
        <div>Calories</div>
        <div>{Math.round(data.calories)}</div>
      </div>

      <div className="text-right text-base font-bold border-b border-black mb-1">% Daily Value*</div>

      {/* Macronutrients */}
      {[
        { label: "Total Fat", value: data.totalFat, unit: "g", dv: 78 },
        { label: "Saturated Fat", value: data.saturatedFat, unit: "g", dv: 20, indent: true },
        { label: "Trans Fat", value: data.transFat, unit: "g", indent: true },
        { label: "Polyunsaturated Fat", value: data.polyunsaturatedFat, unit: "g", indent: true },
        { label: "Monounsaturated Fat", value: data.monounsaturatedFat, unit: "g", indent: true },
        { label: "Cholesterol", value: data.cholesterol, unit: "mg", dv: 300 },
        { label: "Sodium", value: data.sodium, unit: "mg", dv: 2300 },
        { label: "Total Carbohydrate", value: data.totalCarbohydrates, unit: "g", dv: 275 },
        { label: "Dietary Fiber", value: data.dietaryFiber, unit: "g", dv: 28, indent: true },
        { label: "Total Sugars", value: data.sugars, unit: "g", indent: true },
      ].map((item, index) => (
        <div
          key={index}
          className={`flex justify-between border-b border-black py-[2px] ${
            item.indent ? "text-base" : "text-lg font-black"
          }`}
        >
          <div className={item.indent ? "pl-8" : ""}>
            {item.label} {roundNutrientValue(item.value, item.unit)}{item.unit}
          </div>
          {item.dv && <div>{Math.round((item.value / item.dv) * 100)}%</div>}
        </div>
      ))}
      
      {/* Added Sugars - special formatting */}
      <div className="flex justify-between text-base border-b border-black py-[2px]">
        <div className="pl-8">Includes {data.addedSugars || 0}g Added Sugars</div>
        <div>{Math.round(((data.addedSugars || 0) / 50) * 100)}%</div>
      </div>
      
      {/* Protein */}
      <div className="flex justify-between text-lg font-black border-b-8 border-black py-[2px]">
        <div>Protein {roundNutrientValue(data.protein, "g")}g</div>
        <div>{Math.round((data.protein / 50) * 100)}%</div>
      </div>
      
      {/* Micronutrients */}
      <div className="border-b border-black py-[2px]">
        <div className="flex justify-between">
          <div>Vitamin D {roundNutrientValue(data.vitaminD, 'mcg')}mcg</div>
          <div>{Math.round((data.vitaminD / 20) * 100)}%</div>
        </div>
      </div>
      
      <div className="border-b border-black py-[2px]">
        <div className="flex justify-between">
          <div>Calcium {roundNutrientValue(data.calcium, 'mg')}mg</div>
          <div>{Math.round((data.calcium / 1300) * 100)}%</div>
        </div>
      </div>
      
      <div className="border-b border-black py-[2px]">
        <div className="flex justify-between">
          <div>Iron {roundNutrientValue(data.iron, 'mg')}mg</div>
          <div>{Math.round((data.iron / 18) * 100)}%</div>
        </div>
      </div>
      
      <div className="border-b-8 border-black py-[2px]">
        <div className="flex justify-between">
          <div>Potassium {roundNutrientValue(data.potassium, 'mg')}mg</div>
          <div>{Math.round((data.potassium / 4700) * 100)}%</div>
        </div>
      </div>

      <div className="mt-1 text-xs leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food
        contributes to a daily diet. 2,000 calories a day is used for general
        nutrition advice.
      </div>
    </div>
  );
}