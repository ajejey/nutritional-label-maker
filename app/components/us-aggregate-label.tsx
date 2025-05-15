"use client";

import { NutritionData } from "../types/nutrition";

export function USAggregateLabel({ data }: { data: NutritionData }) {
  // The aggregate format is required for variety packs containing different food items
  // FDA regulations in 21 CFR 101.9(d)(13)(ii) specify that aggregate displays must
  // identify each food and its quantitative amount by weight
  // This implementation should be connected to actual product data in production
  
  const foodItems = [
    {
      name: "Item 1",
      servingSize: "1 piece (28g)",
      calories: Math.round(data.calories * 0.7),
      totalFat: data.totalFat * 0.7,
      saturatedFat: data.saturatedFat * 0.7,
      transFat: data.transFat * 0.7,
      cholesterol: data.cholesterol * 0.7,
      sodium: data.sodium * 0.7,
      totalCarbs: data.totalCarbohydrates * 0.7,
      fiber: data.dietaryFiber * 0.7,
      sugars: data.sugars * 0.7,
      protein: data.protein * 0.7
    },
    {
      name: "Item 2",
      servingSize: "1 piece (32g)",
      calories: Math.round(data.calories * 0.9),
      totalFat: data.totalFat * 0.9,
      saturatedFat: data.saturatedFat * 0.9,
      transFat: data.transFat * 0.9,
      cholesterol: data.cholesterol * 0.9,
      sodium: data.sodium * 0.9,
      totalCarbs: data.totalCarbohydrates * 0.9,
      fiber: data.dietaryFiber * 0.9,
      sugars: data.sugars * 0.9,
      protein: data.protein * 0.9
    },
    {
      name: "Item 3",
      servingSize: "1 piece (25g)",
      calories: Math.round(data.calories * 0.6),
      totalFat: data.totalFat * 0.6,
      saturatedFat: data.saturatedFat * 0.6,
      transFat: data.transFat * 0.6,
      cholesterol: data.cholesterol * 0.6,
      sodium: data.sodium * 0.6,
      totalCarbs: data.totalCarbohydrates * 0.6,
      fiber: data.dietaryFiber * 0.6,
      sugars: data.sugars * 0.6,
      protein: data.protein * 0.6
    }
  ];

  return (
    <div 
      className="w-[500px] bg-white p-8 border-2 border-black font-bold text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <div className="text-4xl font-black tracking-tighter border-b-8 border-black pb-2 mb-4">
        Nutrition Facts
      </div>
      <div className="text-base mb-2">
        Variety Pack - {data.servingsPerContainer} total servings
      </div>

      {/* Render each food item with its own nutrition facts */}
      {foodItems.map((item, index) => (
        <div key={index} className="mb-6 border-t-2 border-black pt-2">
          <div className="text-xl font-black mb-2">{item.name}</div>
          <div className="flex justify-between mb-2">
            <div className="text-base">Serving size</div>
            <div className="text-base">{item.servingSize}</div>
          </div>

          <div className="text-base">Amount per serving</div>
          <div className="flex justify-between text-2xl font-black border-b-2 border-black mb-2">
            <div>Calories</div>
            <div>{item.calories}</div>
          </div>

          <div className="text-right text-base border-b border-black mb-2">% Daily Value*</div>

          <div className="flex justify-between text-base font-bold border-b border-black py-1">
            <div>Total Fat {item.totalFat.toFixed(1)}g</div>
            <div>{Math.round((item.totalFat / 78) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base pl-6 border-b border-black py-1">
            <div>Saturated Fat {item.saturatedFat.toFixed(1)}g</div>
            <div>{Math.round((item.saturatedFat / 20) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base pl-6 border-b border-black py-1">
            <div>Trans Fat {item.transFat.toFixed(1)}g</div>
          </div>
          
          <div className="flex justify-between text-base font-bold border-b border-black py-1">
            <div>Cholesterol {item.cholesterol.toFixed(1)}mg</div>
            <div>{Math.round((item.cholesterol / 300) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base font-bold border-b border-black py-1">
            <div>Sodium {item.sodium.toFixed(1)}mg</div>
            <div>{Math.round((item.sodium / 2300) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base font-bold border-b border-black py-1">
            <div>Total Carbohydrates {item.totalCarbs.toFixed(1)}g</div>
            <div>{Math.round((item.totalCarbs / 275) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base pl-6 border-b border-black py-1">
            <div>Dietary Fiber {item.fiber.toFixed(1)}g</div>
            <div>{Math.round((item.fiber / 28) * 100)}%</div>
          </div>
          
          <div className="flex justify-between text-base pl-6 border-b border-black py-1">
            <div>Total Sugars {item.sugars.toFixed(1)}g</div>
          </div>
          
          <div className="flex justify-between text-base font-bold border-b border-black py-1">
            <div>Protein {item.protein.toFixed(1)}g</div>
            <div>{Math.round((item.protein / 50) * 100)}%</div>
          </div>
        </div>
      ))}

      <div className="mt-4 text-sm leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food
        contributes to a daily diet. 2,000 calories a day is used for general
        nutrition advice.
      </div>
    </div>
  );
}
