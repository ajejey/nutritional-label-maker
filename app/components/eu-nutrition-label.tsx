"use client";

import { NutritionData } from "../types/nutrition";

export function EUNutritionLabel({ data }: { data: NutritionData }) {
  // Convert calories to kJ (1 kcal = 4.184 kJ)
  const energyKJ = Math.round(data.calories * 4.184);
  
  // Convert sodium to salt (salt = sodium * 2.5)
  const saltValue = data.sodium / 1000 * 2.5;
  
  // Helper function for formatting values
  const formatValue = (value: number, precision: number = 1): string => {
    return value.toFixed(precision);
  };

  return (
    <div 
      className="w-[400px] bg-white p-6 border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-2xl font-bold mb-4 text-center">
        Nutrition Declaration
      </div>
      
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-t-2 border-black">
            <th className="text-left py-1 font-bold">Nutrition Information</th>
            <th className="text-right py-1 font-bold">Per 100g</th>
            {data.servingSize && (
              <th className="text-right py-1 font-bold">Per Portion ({data.servingSize})</th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Energy in both kJ and kcal (mandatory) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Energy</td>
            <td className="text-right py-1">{energyKJ} kJ / {formatValue(data.calories)} kcal</td>
            {data.servingSize && (
              <td className="text-right py-1">{Math.round(energyKJ * 0.8)} kJ / {Math.round(data.calories * 0.8)} kcal</td>
            )}
          </tr>
          
          {/* Fat and saturated fat (mandatory) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Fat</td>
            <td className="text-right py-1">{formatValue(data.totalFat)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.totalFat * 0.8)} g</td>
            )}
          </tr>
          <tr className="border-b border-gray-300">
            <td className="py-1 pl-4">of which saturates</td>
            <td className="text-right py-1">{formatValue(data.saturatedFat)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.saturatedFat * 0.8)} g</td>
            )}
          </tr>
          
          {/* Carbohydrates and sugars (mandatory) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Carbohydrate</td>
            <td className="text-right py-1">{formatValue(data.totalCarbohydrates)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.totalCarbohydrates * 0.8)} g</td>
            )}
          </tr>
          <tr className="border-b border-gray-300">
            <td className="py-1 pl-4">of which sugars</td>
            <td className="text-right py-1">{formatValue(data.sugars)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.sugars * 0.8)} g</td>
            )}
          </tr>
          
          {/* Protein (mandatory) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Protein</td>
            <td className="text-right py-1">{formatValue(data.protein)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.protein * 0.8)} g</td>
            )}
          </tr>
          
          {/* Salt (mandatory) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Salt</td>
            <td className="text-right py-1">{formatValue(saltValue)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(saltValue * 0.8)} g</td>
            )}
          </tr>
          
          {/* Fiber (optional but common) */}
          <tr className="border-b border-gray-300">
            <td className="py-1 font-bold">Fibre</td>
            <td className="text-right py-1">{formatValue(data.dietaryFiber)} g</td>
            {data.servingSize && (
              <td className="text-right py-1">{formatValue(data.dietaryFiber * 0.8)} g</td>
            )}
          </tr>
        </tbody>
      </table>

      <div className="mt-4 text-xs leading-tight">
        Reference intake of an average adult (8400 kJ / 2000 kcal)
      </div>
    </div>
  );
}