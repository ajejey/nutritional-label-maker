'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeftRight } from 'lucide-react';

const UnitConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('g');
  const [ingredient, setIngredient] = useState('all-purpose-flour');

  // Conversion factors for common ingredients (cups to grams)
  const ingredientDensities: Record<string, number> = {
    'all-purpose-flour': 125,
    'bread-flour': 127,
    'cake-flour': 114,
    'sugar-white': 200,
    'sugar-brown': 213,
    'powdered-sugar': 120,
    'butter': 227,
    'oil': 218,
    'milk': 245,
    'water': 237,
    'honey': 340,
    'cocoa-powder': 75,
    'baking-powder': 4,
    'baking-soda': 4,
    'salt': 18,
    'vanilla-extract': 4,
  };

  const units = [
    { value: 'cup', label: 'Cup', type: 'volume' },
    { value: 'tbsp', label: 'Tablespoon', type: 'volume' },
    { value: 'tsp', label: 'Teaspoon', type: 'volume' },
    { value: 'fl-oz', label: 'Fluid Ounce', type: 'volume' },
    { value: 'ml', label: 'Milliliter', type: 'volume' },
    { value: 'l', label: 'Liter', type: 'volume' },
    { value: 'g', label: 'Gram', type: 'weight' },
    { value: 'kg', label: 'Kilogram', type: 'weight' },
    { value: 'oz', label: 'Ounce', type: 'weight' },
    { value: 'lb', label: 'Pound', type: 'weight' },
  ];

  const ingredients = [
    { value: 'all-purpose-flour', label: 'All-purpose flour' },
    { value: 'bread-flour', label: 'Bread flour' },
    { value: 'cake-flour', label: 'Cake flour' },
    { value: 'sugar-white', label: 'White sugar' },
    { value: 'sugar-brown', label: 'Brown sugar' },
    { value: 'powdered-sugar', label: 'Powdered sugar' },
    { value: 'butter', label: 'Butter' },
    { value: 'oil', label: 'Vegetable oil' },
    { value: 'milk', label: 'Milk' },
    { value: 'water', label: 'Water' },
    { value: 'honey', label: 'Honey' },
    { value: 'cocoa-powder', label: 'Cocoa powder' },
    { value: 'baking-powder', label: 'Baking powder' },
    { value: 'baking-soda', label: 'Baking soda' },
    { value: 'salt', label: 'Salt' },
    { value: 'vanilla-extract', label: 'Vanilla extract' },
  ];

  const convertToGrams = (amount: number, unit: string, ingredient: string): number => {
    const density = ingredientDensities[ingredient] || 125; // Default to flour
    
    switch (unit) {
      case 'cup': return amount * density;
      case 'tbsp': return amount * (density / 16);
      case 'tsp': return amount * (density / 48);
      case 'fl-oz': return amount * (density / 8);
      case 'ml': return amount * (density / 237); // Assuming 1 cup = 237ml
      case 'l': return amount * (density / 0.237);
      case 'g': return amount;
      case 'kg': return amount * 1000;
      case 'oz': return amount * 28.35;
      case 'lb': return amount * 453.59;
      default: return amount;
    }
  };

  const convertFromGrams = (grams: number, unit: string, ingredient: string): number => {
    const density = ingredientDensities[ingredient] || 125;
    
    switch (unit) {
      case 'cup': return grams / density;
      case 'tbsp': return grams / (density / 16);
      case 'tsp': return grams / (density / 48);
      case 'fl-oz': return grams / (density / 8);
      case 'ml': return grams / (density / 237);
      case 'l': return grams / (density / 0.237);
      case 'g': return grams;
      case 'kg': return grams / 1000;
      case 'oz': return grams / 28.35;
      case 'lb': return grams / 453.59;
      default: return grams;
    }
  };

  const convert = (): number => {
    const gramsAmount = convertToGrams(amount, fromUnit, ingredient);
    return convertFromGrams(gramsAmount, toUnit, ingredient);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const result = convert();
  const formattedResult = result < 0.01 ? result.toExponential(2) : 
                        result < 1 ? result.toFixed(3) :
                        result < 10 ? result.toFixed(2) :
                        result.toFixed(1);

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Unit Converter</h1>
        <p className="text-gray-600">Convert between volume and weight measurements</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Converter</CardTitle>
            <CardDescription>Get accurate conversions based on ingredient density</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="ingredient">Ingredient</Label>
              <select
                id="ingredient"
                className="w-full p-3 border border-gray-300 rounded-md mt-1"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              >
                {ingredients.map((ing) => (
                  <option key={ing.value} value={ing.value}>
                    {ing.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.25"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div>
                <Label htmlFor="fromUnit">From</Label>
                <div className="flex gap-2 items-center">
                  <select
                    id="fromUnit"
                    className="flex-1 p-3 border border-gray-300 rounded-md"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                  >
                    {units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={swapUnits}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="toUnit">To</Label>
                <select
                  id="toUnit"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-2">Result</div>
              <div className="text-3xl font-bold text-blue-600">
                {formattedResult} {units.find(u => u.value === toUnit)?.label.toLowerCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                onClick={() => { setAmount(1); setFromUnit('cup'); setToUnit('g'); }}
                variant="outline"
                className="text-sm"
              >
                Cup → Grams
              </Button>
              <Button
                onClick={() => { setAmount(100); setFromUnit('g'); setToUnit('cup'); }}
                variant="outline"
                className="text-sm"
              >
                Grams → Cup
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Volume</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>1 cup = 16 tbsp</li>
                  <li>1 cup = 48 tsp</li>
                  <li>1 tbsp = 3 tsp</li>
                  <li>1 cup = 8 fl oz</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Weight</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>1 lb = 16 oz</li>
                  <li>1 oz = 28.35 g</li>
                  <li>1 kg = 1000 g</li>
                  <li>1 lb = 453.59 g</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnitConverter;