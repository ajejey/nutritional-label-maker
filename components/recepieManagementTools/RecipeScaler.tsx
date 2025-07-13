'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'base' | 'spice' | 'leavening' | 'egg' | 'custom';
  customScaleFactor?: number;
}

const INGREDIENT_CATEGORIES = {
  base: { label: 'Base Ingredient', factor: 1, description: 'Scales linearly' },
  spice: { label: 'Spice/Seasoning', factor: 0.75, description: 'Scales at ~75% to avoid overpowering' },
  leavening: { label: 'Leavening Agent', factor: 0.75, description: 'Scales at ~75% for proper rise' },
  egg: { label: 'Egg', factor: 1, description: 'Round to whole eggs or measure fractions' },
  custom: { label: 'Custom', factor: 1, description: 'Set your own scaling factor' },
};

const RecipeScaler = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'All-purpose flour', amount: 2, unit: 'cups', category: 'base' },
    { id: '2', name: 'Sugar', amount: 1, unit: 'cup', category: 'base' },
    { id: '3', name: 'Butter', amount: 0.5, unit: 'cup', category: 'base' },
  ]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [originalServings, setOriginalServings] = useState(12);
  const [desiredServings, setDesiredServings] = useState(12);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      unit: 'cup',
      category: 'base',
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const scaleByFactor = (factor: number) => {
    setScaleFactor(factor);
    setDesiredServings(Math.round(originalServings * factor));
    toast({
      description: `Recipe scaled by ${factor}x`,
    });
  };

  const scaleByServings = () => {
    const factor = desiredServings / originalServings;
    setScaleFactor(factor);
    toast({
      description: `Recipe scaled to ${desiredServings} servings`,
    });
  };

  const formatAmount = (amount: number, ingredient: Ingredient) => {
    const categoryFactor = ingredient.customScaleFactor ?? INGREDIENT_CATEGORIES[ingredient.category].factor;
    const adjustedScaleFactor = scaleFactor === 1 ? 1 : Math.pow(scaleFactor, categoryFactor);
    const scaled = amount * adjustedScaleFactor;
    
    if (ingredient.category === 'egg' && scaled % 1 !== 0) {
      const wholeEggs = Math.floor(scaled);
      const fraction = scaled - wholeEggs;
      if (fraction >= 0.75) return `${wholeEggs + 1} whole`;
      if (fraction >= 0.5) return `${wholeEggs > 0 ? wholeEggs + ' ' : ''}3/4`;
      if (fraction >= 0.25) return `${wholeEggs > 0 ? wholeEggs + ' ' : ''}1/2`;
      return wholeEggs.toString();
    }
    
    if (scaled < 0.125) return (scaled * 16).toFixed(1) + ' tbsp';
    if (scaled < 1) return scaled.toFixed(2);
    if (scaled === Math.floor(scaled)) return scaled.toString();
    
    // Convert to mixed fractions for common values
    const whole = Math.floor(scaled);
    const decimal = scaled - whole;
    
    if (Math.abs(decimal - 0.25) < 0.01) return `${whole > 0 ? whole + ' ' : ''}1/4`;
    if (Math.abs(decimal - 0.33) < 0.01) return `${whole > 0 ? whole + ' ' : ''}1/3`;
    if (Math.abs(decimal - 0.5) < 0.01) return `${whole > 0 ? whole + ' ' : ''}1/2`;
    if (Math.abs(decimal - 0.67) < 0.01) return `${whole > 0 ? whole + ' ' : ''}2/3`;
    if (Math.abs(decimal - 0.75) < 0.01) return `${whole > 0 ? whole + ' ' : ''}3/4`;
    
    return scaled.toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Recipe Scaler</h1>
        <p className="text-gray-600">Scale your recipes up or down with precision</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Original Recipe</CardTitle>
            <CardDescription>Enter your base recipe ingredients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalServings">Original Servings</Label>
                <Input
                  id="originalServings"
                  type="number"
                  value={originalServings}
                  onChange={(e) => setOriginalServings(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="desiredServings">Desired Servings</Label>
                <div className="flex gap-2">
                  <Input
                    id="desiredServings"
                    type="number"
                    value={desiredServings}
                    onChange={(e) => setDesiredServings(Number(e.target.value))}
                    min="1"
                  />
                  <Button onClick={scaleByServings} size="sm">
                    Scale
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Ingredients</Label>
                <Button onClick={addIngredient} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="space-y-2 p-4 border rounded-lg bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Input
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.25"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(ingredient.id, 'amount', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                      >
                        <option value="cup">cup</option>
                        <option value="cups">cups</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="oz">oz</option>
                        <option value="lb">lb</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={ingredient.category}
                        onChange={(e) => updateIngredient(ingredient.id, 'category', e.target.value)}
                      >
                        {Object.entries(INGREDIENT_CATEGORIES).map(([key, value]) => (
                          <option key={key} value={key}>{value.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        onClick={() => removeIngredient(ingredient.id)}
                        size="sm"
                        variant="outline"
                        className="p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {ingredient.category !== 'base' && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      💡 {INGREDIENT_CATEGORIES[ingredient.category].description}
                      {ingredient.category === 'custom' && (
                        <div className="mt-1">
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Custom factor (1.0 = linear)"
                            value={ingredient.customScaleFactor || ''}
                            onChange={(e) => updateIngredient(ingredient.id, 'customScaleFactor', Number(e.target.value))}
                            className="w-32 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={() => scaleByFactor(0.5)} variant="outline" className="flex-1">
                Half (0.5x)
              </Button>
              <Button onClick={() => scaleByFactor(2)} variant="outline" className="flex-1">
                Double (2x)
              </Button>
              <Button onClick={() => scaleByFactor(3)} variant="outline" className="flex-1">
                Triple (3x)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scaled Recipe</CardTitle>
            <CardDescription>
              Scale factor: {scaleFactor.toFixed(2)}x | Servings: {Math.round(originalServings * scaleFactor)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{ingredient.name || 'Unnamed ingredient'}</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {formatAmount(ingredient.amount, ingredient)} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
            
            {ingredients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Add ingredients to see scaled amounts
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeScaler;
