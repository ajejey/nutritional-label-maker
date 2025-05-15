"use client";

import { NutritionData } from "../types/nutrition";

// Bilingual format is permitted under FDA regulations in 21 CFR 101.15(c)(2)
// All required information must appear in both languages (typically English and Spanish)
// Font sizes, formatting, and order of nutrients must follow the same requirements as English-only labels

export function USBilingualLabel({ data }: { data: NutritionData }) {
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
      className="w-[520px] bg-white p-4 border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-4xl font-black tracking-tighter border-b-8 border-black pb-1">
        Nutrition Facts/Datos de Nutrición
      </div>
      <div className="text-base">
        {data.servingsPerContainer} servings per container/{data.servingsPerContainer} raciones por envase
      </div>
      <div className="flex justify-between border-b-8 border-black pb-1">
        <div className="text-base font-bold">Serving size/Tamaño por ración</div>
        <div className="text-base font-bold">{formatServingSize(data.servingSize)}</div>
      </div>

      <div className="text-sm py-1">Amount per serving/Cantidad por ración</div>
      <div className="flex justify-between text-3xl font-black border-b-4 border-black py-1">
        <div>Calories/Calorías</div>
        <div>{Math.round(data.calories)}</div>
      </div>

      <div className="text-right text-sm border-b border-black py-1">% Daily Value*/Valor Diario*</div>

      {/* Main nutrients */}
      {(() => {
        const nutrients = [
          { labelEn: "Total Fat", labelEs: "Grasa Total", value: data.totalFat, unit: "g", dv: 78 },
          { labelEn: "Saturated Fat", labelEs: "Grasa Saturada", value: data.saturatedFat, unit: "g", dv: 20, indent: true },
          { labelEn: "Trans Fat", labelEs: "Grasa Trans", value: data.transFat, unit: "g", indent: true },
          { labelEn: "Cholesterol", labelEs: "Colesterol", value: data.cholesterol, unit: "mg", dv: 300 },
          { labelEn: "Sodium", labelEs: "Sodio", value: data.sodium, unit: "mg", dv: 2300 },
          { labelEn: "Total Carbohydrate", labelEs: "Carbohidrato Total", value: data.totalCarbohydrates, unit: "g", dv: 275 },
          { labelEn: "Dietary Fiber", labelEs: "Fibra Dietética", value: data.dietaryFiber, unit: "g", dv: 28, indent: true },
          { labelEn: "Total Sugars", labelEs: "Azúcares Totales", value: data.sugars, unit: "g", indent: true },
        ];
        
        return (
          <>
            {nutrients.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between text-sm border-b border-black py-1 ${
                  item.indent ? "pl-4" : "font-bold"
                }`}
              >
                <div>
                  {item.labelEn}/{item.labelEs} {roundNutrientValue(item.value, item.unit)}{item.unit}
                </div>
                {item.dv && <div>{Math.round((item.value / item.dv) * 100)}%</div>}
              </div>
            ))}
            
            {/* Added Sugars line with indent */}
            {data.addedSugars > 0 && (
              <div className="flex justify-between text-sm border-b border-black py-1 pl-8">
                <div>Includes {roundNutrientValue(data.addedSugars, "g")}g Added Sugars/Incluye {roundNutrientValue(data.addedSugars, "g")}g azúcares añadidos</div>
                <div>{Math.round((data.addedSugars / 50) * 100)}%</div>
              </div>
            )}
            
            {/* Protein line */}
            <div className="flex justify-between text-sm border-b-8 border-black py-1 font-bold">
              <div>Protein/Proteínas {roundNutrientValue(data.protein, "g")}g</div>
              {data.protein >= 1 && <div>{Math.round((data.protein / 50) * 100)}%</div>}
            </div>
          </>
        );
      })()}

      {/* Vitamins and Minerals with thick border */}
      <div className="border-b-8 border-black py-1">
        <div className="flex justify-between text-sm py-1">
          <div>Vitamin D/Vitamina D {data.vitaminD}mcg</div>
          <div>{Math.round((data.vitaminD / 20) * 100)}%</div>
        </div>
        <div className="flex justify-between text-sm py-1">
          <div>Calcium/Calcio {data.calcium}mg</div>
          <div>{Math.round((data.calcium / 1300) * 100)}%</div>
        </div>
        <div className="flex justify-between text-sm py-1">
          <div>Iron/Hierro {data.iron}mg</div>
          <div>{Math.round((data.iron / 18) * 100)}%</div>
        </div>
        <div className="flex justify-between text-sm py-1">
          <div>Potassium/Potasio {data.potassium}mg</div>
          <div>{Math.round((data.potassium / 4700) * 100)}%</div>
        </div>
      </div>

      <div className="py-2 text-xs leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
      <div className="pb-2 text-xs leading-tight">
        * El % Valor Diario (VD) le indica cuánto un nutriente en una porción de alimentos contribuye a una dieta diaria. 2,000 calorías al día se usan para asesoramiento de nutrición general.
      </div>
    </div>
  );
}
