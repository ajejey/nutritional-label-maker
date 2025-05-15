import { NutritionData } from "../types/nutrition";

export function CanadaNutritionLabel({ data }: { data: NutritionData }) {
  // Helper function for formatting values
  const formatValue = (value: number, precision: number = 1): string => {
    return value.toFixed(precision);
  };

  // Calculate % Daily Value based on Canadian standards
  const calculateDV = (value: number, dvValue: number): number => {
    return Math.round((value / dvValue) * 100);
  };

  // Format for saturated + trans fat combined
  const satTransTotal = data.saturatedFat + data.transFat;
  const satTransDV = calculateDV(satTransTotal, 20);

  return (
    <div 
      className="w-[400px] bg-white p-5 border-2 border-black text-black" 
      id="nutrition-label"
      style={{ 
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '14px',
      }}
    >
      {/* Header - must be bilingual */}
      <div className="text-3xl font-bold border-b-8 border-black pb-2 mb-3">
        Nutrition Facts<br />
        Valeur nutritive
      </div>

      {/* Serving information - must be bilingual */}
      <div className="text-base mb-3">
        <div className="font-bold">
          Per {data.servingSize || "100 g"} / pour {data.servingSize || "100 g"}
        </div>
        <div>
          {data.servingsPerContainer && (
            <>Serving Size / portion {data.servingSize} ({data.servingsPerContainer} {Number(data.servingsPerContainer) === 1 ? "serving" : "servings"} per container / {data.servingsPerContainer} {Number(data.servingsPerContainer) === 1 ? "portion" : "portions"} par contenant)</>
          )}
        </div>
      </div>

      {/* Calories - must be prominent */}
      <div className="border-t-8 border-b-2 border-black py-2 flex justify-between">
        <div className="font-bold text-lg">
          <span className="font-bold">Calories</span> / Calories {Math.round(data.calories)}
        </div>
        <div className="text-right font-bold">
          % Daily Value*<br />% valeur quotidienne*
        </div>
      </div>

      {/* Fat - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between font-bold">
        <div>Fat / Lipides {formatValue(data.totalFat)} g</div>
        <div>{calculateDV(data.totalFat, 75)}%</div>
      </div>

      {/* Saturated and Trans Fat - mandatory, must be grouped */}
      <div className="border-b border-black py-1.5 flex justify-between">
        <div className="pl-4">Saturated / saturés {formatValue(data.saturatedFat)} g</div>
        <div className="text-right" style={{ marginRight: '0' }}>{satTransDV}%</div>
      </div>
      <div className="border-b border-black py-1.5 flex justify-between">
        <div className="pl-4">+ Trans / trans {formatValue(data.transFat)} g</div>
        <div></div>
      </div>

      {/* Cholesterol - optional in Canada */}
      <div className="border-b border-black py-1.5 flex justify-between">
        <div>Cholesterol / Cholestérol {formatValue(data.cholesterol)} mg</div>
        <div></div>
      </div>

      {/* Sodium - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between font-bold">
        <div>Sodium / Sodium {formatValue(data.sodium)} mg</div>
        <div>{calculateDV(data.sodium, 2300)}%</div>
      </div>

      {/* Carbohydrates - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between font-bold">
        <div>Carbohydrate / Glucides {formatValue(data.totalCarbohydrates)} g</div>
        <div>{calculateDV(data.totalCarbohydrates, 275)}%</div>
      </div>

      {/* Fiber - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between">
        <div className="pl-4">Fibre / Fibres {formatValue(data.dietaryFiber)} g</div>
        <div>{calculateDV(data.dietaryFiber, 28)}%</div>
      </div>

      {/* Sugars - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between">
        <div className="pl-4">Sugars / Sucres {formatValue(data.sugars)} g</div>
        <div>{calculateDV(data.sugars, 100)}%</div>
      </div>

      {/* Protein - mandatory */}
      <div className="border-b border-black py-1.5 flex justify-between font-bold">
        <div>Protein / Protéines {formatValue(data.protein)} g</div>
        <div></div>
      </div>

      {/* Vitamins and Minerals - mandatory */}
      <div className="grid grid-cols-2 gap-2 border-b border-black py-2">
        <div>Vitamin D / Vitamine D {formatValue(data.vitaminD)} µg</div>
        <div className="text-right">{calculateDV(data.vitaminD, 20)}%</div>
        <div>Calcium / Calcium {formatValue(data.calcium)} mg</div>
        <div className="text-right">{calculateDV(data.calcium, 1300)}%</div>
        <div>Iron / Fer {formatValue(data.iron)} mg</div>
        <div className="text-right">{calculateDV(data.iron, 18)}%</div>
        <div>Potassium / Potassium {formatValue(data.potassium)} mg</div>
        <div className="text-right">{calculateDV(data.potassium, 4700)}%</div>
      </div>

      {/* Footnote - mandatory */}
      <div className="text-sm mt-3 leading-tight">
        *5% or less is a little / 5% ou moins c&apos;est peu<br />
        *15% or more is a lot / 15% ou plus c&apos;est beaucoup
      </div>
    </div>
  );
}