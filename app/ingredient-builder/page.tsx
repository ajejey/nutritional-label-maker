'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Recipe, RecipeIngredient } from '../types/recipe';
import { calculateIngredientNutrition } from '../lib/usda-api';
import LabelPreview from '../components/nutrition-label/label-preview';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowRight, FileText, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { USDAIngredientSearch } from '../components/ingredient-search/usda-ingredient-search';

export default function RecipeCalculator() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    servingSize: 1,
    servingUnit: 'serving',
    servingsPerContainer: 1,
    ingredients: [],
    totalNutrition: {
      calories: 0,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 0,
      totalCarbohydrates: 0,
      dietaryFiber: 0,
      sugars: 0,
      protein: 0,
      vitaminD: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
    },
  });

  const progress = Math.min(100, ((activeStep) / 2) * 100);

  const steps = [
    {
      number: 1,
      title: "Add Recipe & Ingredients",
      description: "Enter recipe details and add ingredients",
      isComplete: recipe.name && recipe.servingSize > 0 && recipe.servingsPerContainer > 0 && recipe.ingredients.length > 0
    },
    {
      number: 2,
      title: "Review & Generate",
      description: "Review nutrition information and generate your label",
      isComplete: recipe.ingredients.length > 0
    }
  ];

  const handleAddIngredient = (newIngredient: RecipeIngredient) => {
    setRecipe(prev => {
      const updatedIngredients = [...prev.ingredients, newIngredient];
      const totalNutrition = calculateTotalNutrition(updatedIngredients);

      return {
        ...prev,
        ingredients: updatedIngredients,
        totalNutrition,
      };
    });
  };

  const removeIngredient = (index: number) => {
    setRecipe(prev => {
      const updatedIngredients = prev.ingredients.filter((_, i) => i !== index);
      const totalNutrition = calculateTotalNutrition(updatedIngredients);

      return {
        ...prev,
        ingredients: updatedIngredients,
        totalNutrition,
      };
    });
  };

  const calculateTotalNutrition = (ingredients: RecipeIngredient[]) => {
    return ingredients.reduce((total, ingredient) => {
      const nutrition = calculateIngredientNutrition(
        ingredient.nutritionPer100g,
        ingredient.quantity,
        ingredient.unit
      );

      return {
        calories: (total.calories || 0) + (nutrition.calories || 0),
        totalFat: (total.totalFat || 0) + (nutrition.totalFat || 0),
        saturatedFat: (total.saturatedFat || 0) + (nutrition.saturatedFat || 0),
        transFat: (total.transFat || 0) + (nutrition.transFat || 0),
        cholesterol: (total.cholesterol || 0) + (nutrition.cholesterol || 0),
        sodium: (total.sodium || 0) + (nutrition.sodium || 0),
        totalCarbohydrates: (total.totalCarbohydrates || 0) + (nutrition.totalCarbohydrates || 0),
        dietaryFiber: (total.dietaryFiber || 0) + (nutrition.dietaryFiber || 0),
        sugars: (total.sugars || 0) + (nutrition.sugars || 0),
        protein: (total.protein || 0) + (nutrition.protein || 0),
        vitaminD: (total.vitaminD || 0) + (nutrition.vitaminD || 0),
        calcium: (total.calcium || 0) + (nutrition.calcium || 0),
        iron: (total.iron || 0) + (nutrition.iron || 0),
        potassium: (total.potassium || 0) + (nutrition.potassium || 0),
      };
    }, { ...recipe.totalNutrition });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Ingredient Nutrition Builder</h1>
            <p className="text-gray-500 mt-2">Create nutrition labels for your recipes in 2 easy steps</p>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {recipe.ingredients.length} Ingredients
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {steps.map((step) => (
          <button
            key={step.number}
            onClick={() => setActiveStep(step.number)}
            className={`p-4 rounded-lg border-2 transition-all ${activeStep === step.number
              ? 'border-blue-500 bg-blue-50'
              : step.isComplete
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === step.number
                ? 'bg-blue-500 text-white'
                : step.isComplete
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
                }`}>
                {step.number}
              </div>
              <div className="text-left">
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-gray-500">{step.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipe Name</label>
                    <Input
                      value={recipe.name}
                      onChange={(e) => setRecipe(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter recipe name"
                      className="text-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Serving Size</label>
                      <Input
                        type="number"
                        value={recipe.servingSize}
                        onChange={(e) => setRecipe(prev => ({ ...prev, servingSize: Number(e.target.value) }))}
                        min="1"
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Servings</label>
                      <Input
                        type="number"
                        value={recipe.servingsPerContainer}
                        onChange={(e) => setRecipe(prev => ({ ...prev, servingsPerContainer: Number(e.target.value) }))}
                        min="1"
                        className="text-lg"
                      />
                    </div>
                  </div>
                </div>

              <div className="mt-6">
                <USDAIngredientSearch onIngredientAdd={handleAddIngredient} />
              </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Current Ingredients</h3>

                  </div>
                  {recipe.ingredients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Search and add ingredients to your recipe
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="font-medium">{ingredient.name}</div>
                            <div className="text-sm text-gray-500">
                              {ingredient.quantity} {ingredient.unit}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </Card>
              {recipe.ingredients.length > 0 && recipe.name && recipe.servingSize > 0 && recipe.servingsPerContainer > 0 && (
                <Button
                  variant="default"
                  className='w-full'
                  onClick={() => setActiveStep(2)}
                >
                  Review & Generate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recipe Summary</h2>
                  
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-gray-500">Recipe Name</div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-gray-500">Serving Size</div>
                      <div className="font-medium">{recipe.servingSize}</div>
                      <div className="text-gray-500">Number of Servings</div>
                      <div className="font-medium">{recipe.servingsPerContainer}</div>
                      <div className="text-gray-500">Total Ingredients</div>
                      <div className="font-medium">{recipe.ingredients.length}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(recipe.totalNutrition).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-medium">
                          {typeof value === 'number' ?
                            value.toFixed(1) + (key === 'calories' ? ' kcal' : 'g')
                            : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Review the nutrition information carefully. You can go back to make adjustments if needed.
                </AlertDescription>
              </Alert>
            </div>

            {/* Preview Panel */}
            <div className="lg:sticky lg:top-8">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">Nutrition Label Preview</h2>
                </div>
                <LabelPreview
                  nutritionData={recipe.totalNutrition}
                  compact
                  showInfo={false}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
