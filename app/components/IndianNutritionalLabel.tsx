import { NutritionData } from "../types/nutrition";

export function IndianNutritionalLabel({ data }: { data: NutritionData }) {
  // Convert calories to kJ (1 kcal = 4.184 kJ)
  const energyKJ = Math.round(data.calories * 4.184);

  // Helper function for formatting values
  const formatValue = (value: number, precision: number = 1): string => {
    return value.toFixed(precision);
  };

  // Calculate RDA percentages based on Indian standards
  const calculateRDA = (value: number, rdaValue: number): string => {
    return Math.round((value / rdaValue) * 100) + '%';
  };

  return (
    <div 
      className="w-[400px] bg-white p-4 border border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
      }}
    >
      <h2 className="text-center font-bold text-lg mb-2">NUTRITION INFORMATION</h2>
      <div className="text-xs mb-2">
        <span className="font-bold">Serving size:</span> {data.servingSize || '100g'}
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-t-2 border-black">
            <th className="text-left py-1 font-bold">Nutrients</th>
            <th className="text-right py-1 font-bold">Per 100g</th>
            <th className="text-right py-1 font-bold">% Daily Value*</th>
          </tr>
        </thead>
        <tbody>
          {/* Energy - must be shown in both kcal and kJ */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Energy</td>
            <td className="text-right">{Math.round(data.calories)} kcal ({energyKJ} kJ)</td>
            <td className="text-right">{calculateRDA(data.calories, 2000)}</td>
          </tr>
          
          {/* Total Fat - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Total Fat</td>
            <td className="text-right">{formatValue(data.totalFat)} g</td>
            <td className="text-right">{calculateRDA(data.totalFat, 65)}</td>
          </tr>
          
          {/* Saturated Fat - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="pl-4">Saturated Fat</td>
            <td className="text-right">{formatValue(data.saturatedFat)} g</td>
            <td className="text-right">{calculateRDA(data.saturatedFat, 20)}</td>
          </tr>
          
          {/* Trans Fat - mandatory in India */}
          <tr className="border-b border-gray-300">
            <td className="pl-4">Trans Fat</td>
            <td className="text-right">{formatValue(data.transFat)} g</td>
            <td className="text-right">-</td>
          </tr>
          
          {/* Cholesterol - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Cholesterol</td>
            <td className="text-right">{formatValue(data.cholesterol)} mg</td>
            <td className="text-right">{calculateRDA(data.cholesterol, 300)}</td>
          </tr>
          
          {/* Sodium - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Sodium</td>
            <td className="text-right">{formatValue(data.sodium)} mg</td>
            <td className="text-right">{calculateRDA(data.sodium, 2300)}</td>
          </tr>
          
          {/* Total Carbohydrates - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Total Carbohydrates</td>
            <td className="text-right">{formatValue(data.totalCarbohydrates)} g</td>
            <td className="text-right">{calculateRDA(data.totalCarbohydrates, 300)}</td>
          </tr>
          
          {/* Dietary Fiber - mandatory in India */}
          <tr className="border-b border-gray-300">
            <td className="pl-4">Dietary Fiber</td>
            <td className="text-right">{formatValue(data.dietaryFiber)} g</td>
            <td className="text-right">{calculateRDA(data.dietaryFiber, 25)}</td>
          </tr>
          
          {/* Total Sugars - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="pl-4">Total Sugars</td>
            <td className="text-right">{formatValue(data.sugars)} g</td>
            <td className="text-right">-</td>
          </tr>
          
          {/* Added Sugars - optional but recommended */}
          {data.addedSugars > 0 && (
            <tr className="border-b border-gray-300">
              <td className="pl-8">Added Sugars</td>
              <td className="text-right">{formatValue(data.addedSugars)} g</td>
              <td className="text-right">-</td>
            </tr>
          )}
          
          {/* Protein - mandatory */}
          <tr className="border-b border-gray-300">
            <td className="font-bold">Protein</td>
            <td className="text-right">{formatValue(data.protein)} g</td>
            <td className="text-right">{calculateRDA(data.protein, 50)}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="mt-2 text-xs">
        *Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
      </div>
    </div>
  );
}