"use client";

import { NutritionData } from "../types/nutrition";

// Linear format is specified under FDA regulations 21 CFR 101.9(j)(13)(ii)(A)
// for packages with less than 40 square inches available to bear labeling

export function USLinearLabel({ data }: { data: NutritionData }) {
  // Helper function for rounding values according to FDA rules
  const roundNutrientValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return '0'; // Or handle as per requirement for undefined values
    if (unit === 'g') {
      if (value < 0.5) return value.toFixed(1);
      if (value < 1 && value >= 0.5) return '1'; // FDA rounds 0.5g to <1g if next nutrient is 0, otherwise to 1g. Simpler to just use 1 for now.
      return Math.round(value).toString();
    }
    if (unit === 'mg') {
      if (value < 5) return Math.round(value).toString();
      if (value < 50) return (Math.round(value / 5) * 5).toString();
      return (Math.round(value / 10) * 10).toString();
    }
    if (unit === 'mcg') {
      if (value < 10) return Math.round(value).toString();
      if (value < 50) return (Math.round(value / 5) * 5).toString();
      return (Math.round(value / 10) * 10).toString();
    }
    return Math.round(value).toString();
  };

  // Format serving size with units
  const formatServingSize = (servingSize: string | number | undefined): string => {
    if (servingSize === undefined) return '';
    if (typeof servingSize === 'string' && servingSize.includes('(')) {
      return servingSize;
    }
    const size = typeof servingSize === 'number' ? servingSize : parseFloat(servingSize || '0');
    const unitMatch = typeof servingSize === 'string' ? servingSize.match(/\((.*)\)/) : null;
    const unit = unitMatch ? unitMatch[1] : `${size}g`; // Default to grams if no unit provided
    return `${servingSize.toString().replace(/\s*\(.*\)/, '')} (${unit})`;
  };

  const getDV = (value: number | undefined, dailyValue: number) => {
    if (value === undefined || dailyValue === 0) return 0;
    return Math.round((value / dailyValue) * 100);
  };

  const servings = data.servingsPerContainer || 'N/A';
  const servingSize = formatServingSize(data.servingSize);

  let nutrientString = `<span style="font-size: 8pt;">Amount per serving: `;
  nutrientString += `<span style="font-weight: bold; font-size: 10pt;">Calories</span> <span style="font-size: 14pt; font-weight: bold;">${roundNutrientValue(data.calories, '')}</span>, `;
  nutrientString += `<span style="font-weight: bold;">Total Fat</span> ${roundNutrientValue(data.totalFat, 'g')}g (${getDV(data.totalFat, 78)}% DV), `;
  nutrientString += `Sat. Fat ${roundNutrientValue(data.saturatedFat, 'g')}g (${getDV(data.saturatedFat, 20)}% DV), `;
  nutrientString += `Trans Fat ${roundNutrientValue(data.transFat, 'g')}g, `;
  nutrientString += `<span style="font-weight: bold;">Cholest.</span> ${roundNutrientValue(data.cholesterol, 'mg')}mg (${getDV(data.cholesterol, 300)}% DV), `;
  nutrientString += `<span style="font-weight: bold;">Sodium</span> ${roundNutrientValue(data.sodium, 'mg')}mg (${getDV(data.sodium, 2300)}% DV), `;
  nutrientString += `<span style="font-weight: bold;">Total Carb.</span> ${roundNutrientValue(data.totalCarbohydrates, 'g')}g (${getDV(data.totalCarbohydrates, 275)}% DV), `;
  nutrientString += `Fiber ${roundNutrientValue(data.dietaryFiber, 'g')}g (${getDV(data.dietaryFiber, 28)}% DV), `;
  nutrientString += `Total Sugars ${roundNutrientValue(data.sugars, 'g')}g (Incl. ${roundNutrientValue(data.addedSugars, 'g')}g Added Sugars, ${getDV(data.addedSugars, 50)}% DV), `;
  nutrientString += `<span style="font-weight: bold;">Protein</span> ${roundNutrientValue(data.protein, 'g')}g, `;
  nutrientString += `Vit. D ${roundNutrientValue(data.vitaminD, 'mcg')}mcg (${getDV(data.vitaminD, 20)}% DV), `;
  nutrientString += `Calcium ${roundNutrientValue(data.calcium, 'mg')}mg (${getDV(data.calcium, 1300)}% DV), `;
  nutrientString += `Iron ${roundNutrientValue(data.iron, 'mg')}mg (${getDV(data.iron, 18)}% DV), `;
  nutrientString += `Potas. ${roundNutrientValue(data.potassium, 'mg')}mg (${getDV(data.potassium, 4700)}% DV).</span>`;

  // Replace trailing comma with a period if it exists
  if (nutrientString.endsWith(', ')) {
    nutrientString = nutrientString.slice(0, -2) + '.';
  }

  return (
    <div 
      className="w-auto bg-white p-2 border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '8pt', // FDA requires minimum 8 point font for linear display
        lineHeight: '1.2',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <span style={{ fontSize: '10pt', fontWeight: 'bold' }}>Nutrition Facts</span> 
      <span style={{ fontSize: '8pt', fontWeight: 'normal' }} className="ml-1">Servings: {servings}, </span>
      <span style={{ fontSize: '8pt', fontWeight: 'normal' }}><span style={{ fontWeight: 'bold' }}>Serv. size:</span> {servingSize}</span>
      
      <div className="mt-1" dangerouslySetInnerHTML={{ __html: nutrientString }} />

      <div className="mt-1" style={{ fontSize: '7pt' }}>
        *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );

}
