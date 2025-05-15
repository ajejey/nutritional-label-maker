"use client";

import { NutritionData } from "../types/nutrition";

// Dual column format is specified under FDA regulations 21 CFR 101.9(b)(12)(i)
// Required for packages containing at least 200% and up to and including 300% of the applicable reference amount
// Must present nutrition information per serving and per container (or unit, as applicable)

export function USDualColumnLabel({ data }: { data: NutritionData }) {
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
  
  // Format serving size with units
  const formatServingSize = (servingSize: string | number): string => {
    if (typeof servingSize === 'string' && servingSize.includes('(')) {
      return servingSize;
    }
    return `${servingSize} (${typeof servingSize === 'number' ? servingSize : '0'}g)`;
  };
  return (
    <div 
      className="w-[500px] bg-white p-4 border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-4xl font-black tracking-tighter border-b-8 border-black pb-1">
        Nutrition Facts
      </div>
      <div className="text-base border-b border-black py-1">
        {data.servingsPerContainer} servings per container
      </div>
      <div className="flex justify-between border-b-8 border-black py-1">
        <div className="text-base font-bold">Serving size</div>
        <div className="text-base font-bold">{formatServingSize(data.servingSize)}</div>
      </div>

      {/* Black divider bar */}
      <div className="h-2 bg-black"></div>
      
      {/* Column Headers */}
      <div className="grid grid-cols-3 border-b border-black relative">
        <div className="col-span-1"></div>
        <div className="col-span-1 text-center text-sm font-bold py-1">Per serving</div>
        <div className="col-span-1 text-center text-sm font-bold py-1">Per container</div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>

      {/* Calories Row */}
      <div className="grid grid-cols-3 border-b-4 border-black relative">
        <div className="col-span-1 text-3xl font-black py-1">Calories</div>
        <div className="col-span-1 text-3xl font-black text-center py-1">{Math.round(data.calories)}</div>
        <div className="col-span-1 text-3xl font-black text-center py-1">{Math.round(data.calories * Number(data.servingsPerContainer))}</div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>

      {/* % Daily Value Headers */}
      <div className="grid grid-cols-3 border-b border-black relative">
        <div className="col-span-1"></div>
        <div className="col-span-1 text-right text-sm py-1">% DV*</div>
        <div className="col-span-1 text-right text-sm py-1">% DV*</div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>

      {/* Main nutrients */}
      {(() => {
        const nutrients = [
          { label: "Total Fat", value: data.totalFat, unit: "g", dv: 78 },
          { label: "Saturated Fat", value: data.saturatedFat, unit: "g", dv: 20, indent: true },
          { label: "Trans Fat", value: data.transFat, unit: "g", indent: true },
          { label: "Cholesterol", value: data.cholesterol, unit: "mg", dv: 300 },
          { label: "Sodium", value: data.sodium, unit: "mg", dv: 2300 },
          { label: "Total Carb.", value: data.totalCarbohydrates, unit: "g", dv: 275 },
          { label: "Dietary Fiber", value: data.dietaryFiber, unit: "g", dv: 28, indent: true },
          { label: "Total Sugars", value: data.sugars, unit: "g", indent: true },
        ];
        
        return (
          <>
            {nutrients.map((item, index) => {
              const perServingValue = roundNutrientValue(item.value, item.unit);
              const perContainerValue = roundNutrientValue(item.value * Number(data.servingsPerContainer), item.unit);
              
              return (
                <div
                  key={index}
                  className={`grid grid-cols-3 border-b border-black py-1 relative ${
                    item.indent ? "" : "font-bold"
                  }`}
                >
                  <div className={`col-span-1 ${item.indent ? "pl-4" : ""}`}>
                    {item.label}
                  </div>
                  <div className="col-span-1 flex justify-between px-2">
                    <span className="pl-2">{perServingValue}{item.unit}</span>
                    {item.dv && <span className="text-right pr-2">{Math.round((item.value / item.dv) * 100)}%</span>}
                  </div>
                  <div className="col-span-1 flex justify-between px-2">
                    <span className="pl-2">{perContainerValue}{item.unit}</span>
                    {item.dv && <span className="text-right pr-2">{Math.round((item.value * Number(data.servingsPerContainer) / item.dv) * 100)}%</span>}
                  </div>
                  {/* Vertical divider lines */}
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
                  <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
                </div>
              );
            })}
            
            {/* Added Sugars line with indent */}
            {data.addedSugars > 0 && (
              <div className="grid grid-cols-3 border-b border-black py-1 relative">
                <div className="col-span-1 pl-8">Incl. Added Sugars</div>
                <div className="col-span-1 flex justify-between px-2">
                  <span className="pl-2">{roundNutrientValue(data.addedSugars, "g")}g</span>
                  <span className="text-right pr-2">{Math.round((data.addedSugars / 50) * 100)}%</span>
                </div>
                <div className="col-span-1 flex justify-between px-2">
                  <span className="pl-2">{roundNutrientValue(data.addedSugars * Number(data.servingsPerContainer), "g")}g</span>
                  <span className="text-right pr-2">{Math.round((data.addedSugars * Number(data.servingsPerContainer) / 50) * 100)}%</span>
                </div>
                {/* Vertical divider lines */}
                <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
                <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
              </div>
            )}
            
            {/* Protein line */}
            <div className="grid grid-cols-3 border-b-8 border-black py-1 font-bold relative">
              <div className="col-span-1">Protein</div>
              <div className="col-span-1 flex justify-between px-2">
                <span className="pl-2">{roundNutrientValue(data.protein, "g")}g</span>
                <span className="text-right pr-2">{Math.round((data.protein / 50) * 100)}%</span>
              </div>
              <div className="col-span-1 flex justify-between px-2">
                <span className="pl-2">{roundNutrientValue(data.protein * Number(data.servingsPerContainer), "g")}g</span>
                <span className="text-right pr-2">{Math.round((data.protein * Number(data.servingsPerContainer) / 50) * 100)}%</span>
              </div>
              {/* Vertical divider lines */}
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
              <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
            </div>
          </>
        );
      })()}

      {/* Vitamins and Minerals */}
      <div className="grid grid-cols-3 border-b border-black py-1 relative">
        <div className="col-span-1">Vitamin D</div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.vitaminD, "mcg")}mcg</span>
          <span className="text-right pr-2">{Math.round((data.vitaminD / 20) * 100)}%</span>
        </div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.vitaminD * Number(data.servingsPerContainer), "mcg")}mcg</span>
          <span className="text-right pr-2">{Math.round((data.vitaminD * Number(data.servingsPerContainer) / 20) * 100)}%</span>
        </div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>
      <div className="grid grid-cols-3 border-b border-black py-1 relative">
        <div className="col-span-1">Calcium</div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.calcium, "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.calcium / 1300) * 100)}%</span>
        </div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.calcium * Number(data.servingsPerContainer), "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.calcium * Number(data.servingsPerContainer) / 1300) * 100)}%</span>
        </div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>
      <div className="grid grid-cols-3 border-b border-black py-1 relative">
        <div className="col-span-1">Iron</div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.iron, "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.iron / 18) * 100)}%</span>
        </div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.iron * Number(data.servingsPerContainer), "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.iron * Number(data.servingsPerContainer) / 18) * 100)}%</span>
        </div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>
      <div className="grid grid-cols-3 border-b-8 border-black py-1 relative">
        <div className="col-span-1">Potassium</div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.potassium, "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.potassium / 4700) * 100)}%</span>
        </div>
        <div className="col-span-1 flex justify-between px-2">
          <span className="pl-2">{roundNutrientValue(data.potassium * Number(data.servingsPerContainer), "mg")}mg</span>
          <span className="text-right pr-2">{Math.round((data.potassium * Number(data.servingsPerContainer) / 4700) * 100)}%</span>
        </div>
        {/* Vertical divider lines */}
        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black"></div>
        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-black"></div>
      </div>

      <div className="py-2 text-xs leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );
}
