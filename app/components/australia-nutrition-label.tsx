import React from 'react';
import { NutritionData } from '../types/nutrition';

interface AustraliaNutritionLabelProps {
  data: NutritionData;
}

export const AustraliaNutritionLabel: React.FC<AustraliaNutritionLabelProps> = ({ data }) => {
  const servingSize: number = Number(data.servingSize) || 100;

  // Helper functions for calculations
  const calculatePer100g = (value: number): string => {
    return ((value * 100) / servingSize).toFixed(1);
  };

  // Convert calories to kilojoules (1 kcal = 4.184 kJ)
  const caloriesInKJ = (value: number): string => {
    return (value * 4.184).toFixed(0);
  };

  // Format numbers for display
  const formatNumber = (value: number): string => {
    return value.toFixed(1);
  };

  return (
    <div className="nutrition-label bg-white p-4 border-2 border-black w-[400px] font-sans text-sm">
      <div className="text-center font-bold border-b-2 border-black pb-2 mb-2">
        <h2 className="text-lg">NUTRITION INFORMATION</h2>
        <p>Servings per package: {data.servingsPerContainer || 1}</p>
        <p>Serving size: {data.servingSize || '100'}g</p>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-1"></th>
            <th className="text-right py-1">Per Serving</th>
            <th className="text-right py-1">Per 100g</th>
          </tr>
        </thead>
        <tbody>
          {/* Energy must be shown in both kJ and kcal */}
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Energy</td>
            <td className="text-right">{caloriesInKJ(data.calories)}kJ ({Math.round(data.calories)}kcal)</td>
            <td className="text-right">{caloriesInKJ(Number(calculatePer100g(data.calories)))}kJ ({calculatePer100g(data.calories)}kcal)</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Protein</td>
            <td className="text-right">{formatNumber(data.protein)}g</td>
            <td className="text-right">{calculatePer100g(data.protein)}g</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Fat, total</td>
            <td className="text-right">{formatNumber(data.totalFat)}g</td>
            <td className="text-right">{calculatePer100g(data.totalFat)}g</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 pl-4">- saturated</td>
            <td className="text-right">{formatNumber(data.saturatedFat)}g</td>
            <td className="text-right">{calculatePer100g(data.saturatedFat)}g</td>
          </tr>
          {data.transFat > 0 && (
            <tr className="border-b border-black">
              <td className="py-1 pl-4">- trans</td>
              <td className="text-right">{formatNumber(data.transFat)}g</td>
              <td className="text-right">{calculatePer100g(data.transFat)}g</td>
            </tr>
          )}
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Carbohydrate</td>
            <td className="text-right">{formatNumber(data.totalCarbohydrates)}g</td>
            <td className="text-right">{calculatePer100g(data.totalCarbohydrates)}g</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 pl-4">- sugars</td>
            <td className="text-right">{formatNumber(data.sugars)}g</td>
            <td className="text-right">{calculatePer100g(data.sugars)}g</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Dietary fibre</td>
            <td className="text-right">{formatNumber(data.dietaryFiber)}g</td>
            <td className="text-right">{calculatePer100g(data.dietaryFiber)}g</td>
          </tr>
          <tr className="border-b border-black">
            <td className="py-1 font-bold">Sodium</td>
            <td className="text-right">{formatNumber(data.sodium)}mg</td>
            <td className="text-right">{calculatePer100g(data.sodium)}mg</td>
          </tr>
          {/* Optional but recommended nutrients */}
          {data.potassium > 0 && (
            <tr className="border-b border-black">
              <td className="py-1">Potassium</td>
              <td className="text-right">{formatNumber(data.potassium)}mg</td>
              <td className="text-right">{calculatePer100g(data.potassium)}mg</td>
            </tr>
          )}
          {data.calcium > 0 && (
            <tr className="border-b border-black">
              <td className="py-1">Calcium</td>
              <td className="text-right">{formatNumber(data.calcium)}mg</td>
              <td className="text-right">{calculatePer100g(data.calcium)}mg</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 text-xs">
        <p>* The average adult daily energy intake is 8700kJ (2080kcal).</p>
        <p>† Percentage Daily Intakes are based on an average adult diet of 8700kJ.</p>
        <p>Your daily intakes may be higher or lower depending on your energy needs.</p>
      </div>
    </div>
  );
};

