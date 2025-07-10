'use client'
import { useEffect, useState, useRef, useCallback } from 'react';
import { trackRecipe, trackSearchQuery } from '../../app/lib/analytics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ArrowRight } from 'lucide-react';
import { USDAIngredientSearch } from '../components/ingredient-search/usda-ingredient-search';
import LabelPreview from '../components/nutrition-label/label-preview';
import { calculateIngredientNutrition } from '../lib/usda-api';
import { RecipeIngredient, Recipe } from '../types/recipe';
import { NutritionData } from '../types/nutrition';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { RecipeHeader } from '../components/recipe-header/recipe-header';
import { SaveIndicator, SaveStatus } from '../components/save-indicator/save-indicator';
import { saveCurrentRecipe, getCurrentRecipe, createNewRecipe, loadRecipe } from '../lib/local-storage';
import { useToast } from '@/components/ui/use-toast';
// import { useToast } from '@/components/ui/use-toast';

export default function IngredientBuilder() {
  const { toast } = useToast();

  // Initialize recipe state with default values
  const [recipe, setRecipe] = useState<Recipe>({
    id: `recipe-${Date.now()}`,
    name: 'My Recipe',
    servingSize: 100,
    servingUnit: 'g',
    servingsPerContainer: 1,
    ingredients: [] as RecipeIngredient[],
    totalNutrition: {
      calories: 0,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      polyunsaturatedFat: 0,
      monounsaturatedFat: 0,
      cholesterol: 0,
      sodium: 0,
      totalCarbohydrates: 0,
      dietaryFiber: 0,
      sugars: 0,
      addedSugars: 0,
      protein: 0,
      vitaminD: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
      servingSize: 100,
      servingsPerContainer: 1
    } as NutritionData,
  });

  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  // Track recipe changes with debouncing
  const lastTrackedRef = useRef<string>('');
  const trackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevStepRef = useRef(activeStep);
  
  // Debounced tracking function to avoid excessive API calls
  const debouncedTrackRecipe = useCallback((recipeToTrack: Recipe) => {
    // Clear any existing timeout
    if (trackTimeoutRef.current) {
      clearTimeout(trackTimeoutRef.current);
    }
    
    // Set a new timeout
    trackTimeoutRef.current = setTimeout(() => {
      // Make sure recipe has required fields before tracking
      if (recipeToTrack && recipeToTrack.name && recipeToTrack.ingredients && Array.isArray(recipeToTrack.ingredients)) {
        // Create a signature of the recipe to avoid duplicate tracking
        const recipeSignature = JSON.stringify({
          name: recipeToTrack.name,
          ingredientCount: recipeToTrack.ingredients.length,
          ingredients: recipeToTrack.ingredients.map(i => i.fdcId)
        });
        
        // Only track if the recipe has changed significantly
        if (recipeSignature !== lastTrackedRef.current) {
          console.log('Tracking recipe changes:', recipeToTrack);
          trackRecipe(recipeToTrack);
          lastTrackedRef.current = recipeSignature;
        }
      } else {
        console.warn('Cannot track recipe - incomplete data:', recipeToTrack);
      }
    }, 3000); // 3 second debounce
  }, []);
  
  // Track recipe in multiple scenarios
  useEffect(() => {
    // Track when recipe has meaningful content
    if (recipe && recipe.name && recipe.ingredients && recipe.ingredients.length > 0) {
      debouncedTrackRecipe(recipe);
    }
    
    // Also track when user reaches review step
    if (activeStep === 2 && prevStepRef.current !== 2) {
      if (recipe && recipe.name && recipe.ingredients && Array.isArray(recipe.ingredients)) {
        console.log('Tracking recipe on review step:', recipe);
        trackRecipe(recipe);
      }
    }
    prevStepRef.current = activeStep;
    
    // Cleanup timeout on unmount
    return () => {
      if (trackTimeoutRef.current) {
        clearTimeout(trackTimeoutRef.current);
      }
    };
  }, [activeStep, recipe, debouncedTrackRecipe]);

  // Load saved recipe on initial render or when URL changes
  useEffect(() => {
    // Check if there's a recipe ID in the URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (recipeId) {
      // Load the specific recipe
      const loadedRecipe = loadRecipe(recipeId);
      if (loadedRecipe) {
        setRecipe(loadedRecipe.data.recipe);
        setActiveStep(loadedRecipe.data.activeStep);
        toast({
          title: "Recipe Loaded",
          description: `Loaded recipe: ${loadedRecipe.name}`,
        });
      }
    } else {
      // Load the current recipe or create a new one
      const currentRecipe = getCurrentRecipe();
      if (currentRecipe) {
        setRecipe(currentRecipe.data.recipe);
        setActiveStep(currentRecipe.data.activeStep);
      } else {
        // Create a new recipe
        const newRecipe = createNewRecipe();
        setRecipe(newRecipe.data.recipe);
      }
    }
  }, []);

  // Define steps for the wizard
  const steps = [
    {
      number: 1,
      title: 'Add Recipe & Ingredients',
      description: 'Enter recipe details and add ingredients',
      isComplete: recipe.name !== '' && recipe.servingSize > 0 && recipe.ingredients.length > 0,
    },
    {
      number: 2,
      title: 'Review & Generate',
      description: 'Review nutrition facts and generate label',
      isComplete: false,
    },
  ];

  // Add ingredient handler with auto-save
  const handleAddIngredient = (ingredient: RecipeIngredient) => {
    setSaveStatus('saving');
    setRecipe((prev) => {
      const updatedRecipe = {
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
        totalNutrition: calculateTotalNutrition([...prev.ingredients, ingredient]),
      };

      // Save to local storage
      saveCurrentRecipe(updatedRecipe, activeStep);

      // Update save status after a short delay to show the saving animation
      setTimeout(() => setSaveStatus('saved'), 500);

      return updatedRecipe;
    });
  };

  // Remove ingredient handler with auto-save
  const handleRemoveIngredient = (index: number) => {
    setSaveStatus('saving');
    setRecipe((prev) => {
      const newIngredients = prev.ingredients.filter((_, i) => i !== index);
      const updatedRecipe = {
        ...prev,
        ingredients: newIngredients,
        totalNutrition: calculateTotalNutrition(newIngredients),
      };

      // Save to local storage
      saveCurrentRecipe(updatedRecipe, activeStep);

      // Update save status after a short delay
      setTimeout(() => setSaveStatus('saved'), 500);

      return updatedRecipe;
    });
  };

  // Calculate total nutrition
  const calculateTotalNutrition = (ingredients: RecipeIngredient[]): NutritionData => {
    // Existing calculation logic
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
        polyunsaturatedFat: (total.polyunsaturatedFat || 0) + (nutrition.polyunsaturatedFat || 0),
        monounsaturatedFat: (total.monounsaturatedFat || 0) + (nutrition.monounsaturatedFat || 0),
        cholesterol: (total.cholesterol || 0) + (nutrition.cholesterol || 0),
        sodium: (total.sodium || 0) + (nutrition.sodium || 0),
        totalCarbohydrates: (total.totalCarbohydrates || 0) + (nutrition.totalCarbohydrates || 0),
        dietaryFiber: (total.dietaryFiber || 0) + (nutrition.dietaryFiber || 0),
        sugars: (total.sugars || 0) + (nutrition.sugars || 0),
        addedSugars: (total.addedSugars || 0) + (nutrition.addedSugars || 0),
        protein: (total.protein || 0) + (nutrition.protein || 0),
        vitaminD: (total.vitaminD || 0) + (nutrition.vitaminD || 0),
        calcium: (total.calcium || 0) + (nutrition.calcium || 0),
        iron: (total.iron || 0) + (nutrition.iron || 0),
        potassium: (total.potassium || 0) + (nutrition.potassium || 0),
        servingSize: recipe.servingSize,
        servingsPerContainer: recipe.servingsPerContainer
      };
    }, {
      calories: 0,
      totalFat: 0,
      saturatedFat: 0,
      transFat: 0,
      polyunsaturatedFat: 0,
      monounsaturatedFat: 0,
      cholesterol: 0,
      sodium: 0,
      totalCarbohydrates: 0,
      dietaryFiber: 0,
      sugars: 0,
      addedSugars: 0,
      protein: 0,
      vitaminD: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
      servingSize: recipe.servingSize,
      servingsPerContainer: recipe.servingsPerContainer
    } as NutritionData);
  };

  // Handle recipe name change
  const handleRecipeNameChange = (name: string) => {
    setSaveStatus('saving');
    setRecipe(prev => {
      const updatedRecipe = {
        ...prev,
        name
      };

      // Save to local storage
      saveCurrentRecipe(updatedRecipe, activeStep);

      // Update save status after a short delay
      setTimeout(() => setSaveStatus('saved'), 500);

      return updatedRecipe;
    });
  };

  // Handle serving size change
  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSaveStatus('saving');
      setRecipe(prev => {
        const updatedRecipe = {
          ...prev,
          servingSize: value,
          totalNutrition: {
            ...prev.totalNutrition,
            servingSize: value
          }
        };

        // Save to local storage
        saveCurrentRecipe(updatedRecipe, activeStep);

        // Update save status after a short delay
        setTimeout(() => setSaveStatus('saved'), 500);

        return updatedRecipe;
      });
    }
  };

  // Handle servings per container change
  const handleServingsPerContainerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSaveStatus('saving');
      setRecipe(prev => {
        const updatedRecipe = {
          ...prev,
          servingsPerContainer: value,
          totalNutrition: {
            ...prev.totalNutrition,
            servingsPerContainer: value
          }
        };

        // Save to local storage
        saveCurrentRecipe(updatedRecipe, activeStep);

        // Update save status after a short delay
        setTimeout(() => setSaveStatus('saved'), 500);

        return updatedRecipe;
      });
    }
  };

  // Save when step changes
  useEffect(() => {
    if (recipe.id) { // Only save if recipe has been initialized
      setSaveStatus('saving');
      saveCurrentRecipe(recipe, activeStep);
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  }, [activeStep, recipe]);

  // Missing fields validation
  const missingFields = [];
  if (!recipe.name) missingFields.push('Product Name');
  if (!recipe.servingSize || recipe.servingSize <= 0) missingFields.push('Serving Size');
  if (!recipe.servingsPerContainer || recipe.servingsPerContainer <= 0) missingFields.push('Servings Per Container');
  if (recipe.ingredients.length === 0) missingFields.push('At least one ingredient');

  return (
    <>
      {/* <RecipeHeader 
        recipeName={recipe.name} 
        onNameChange={handleRecipeNameChange} 
        saveStatus={saveStatus} 
        currentRecipeId={recipe.id}
      /> */}
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Ingredient Nutrition Builder</h1>
              <p className="text-gray-600">Create nutrition labels from your ingredients</p>
            </div>
          </div>
          <RecipeHeader
            recipeName={recipe.name}
            onNameChange={handleRecipeNameChange}
            saveStatus={saveStatus}
            currentRecipeId={recipe.id}
          />
          {/* Progress Steps */}
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
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep === step.number
                        ? 'bg-blue-500 text-white'
                        : step.isComplete
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200'
                      }`}
                  >
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
        </div>

        {/* Step Content */}
        {activeStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      value={recipe.name}
                      onChange={(e) => handleRecipeNameChange(e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="servingSize">Serving Size (g) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        id="servingSize"
                        placeholder="100"
                        value={recipe.servingSize || ''}
                        onChange={handleServingSizeChange}
                        onBlur={() => {
                          if (!recipe.servingSize) {
                            setRecipe(prev => ({ ...prev, servingSize: 100 }));
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="servingsPerContainer">
                        Servings Per Container <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        id="servingsPerContainer"
                        placeholder="1"
                        value={recipe.servingsPerContainer || ''}
                        onChange={handleServingsPerContainerChange}
                        onBlur={() => {
                          if (!recipe.servingsPerContainer) {
                            setRecipe(prev => ({ ...prev, servingsPerContainer: 1 }));
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <USDAIngredientSearch onIngredientAdd={handleAddIngredient} />

              {recipe.ingredients.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Added Ingredients</h3>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div
                        key={`${ingredient.fdcId}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Next Step Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full"
                      disabled={missingFields.length > 0}
                      onClick={() => missingFields.length === 0 && setActiveStep(2)}
                    >
                      {missingFields.length > 0 ? (
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Review & Generate
                        </div>
                      ) : (
                        <>
                          Review & Generate
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {missingFields.length > 0 && (
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-bold">Complete the following to proceed:</p>
                        <ul className="list-disc pl-4 text-sm">
                          {missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Preview Column */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Nutrition Label Preview</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
                {showPreview && (
                  <LabelPreview
                    nutritionData={recipe.totalNutrition}
                    compact
                    showInfo={false}
                  />
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Review Step */}
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
                      <div className="text-gray-500">Product Name</div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-gray-500">Serving Size</div>
                      <div className="font-medium">{recipe.servingSize}g</div>
                      <div className="text-gray-500">Servings Per Container</div>
                      <div className="font-medium">{recipe.servingsPerContainer}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(recipe.totalNutrition).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="font-medium">
                          {typeof value === 'number'
                            ? `${value.toFixed(1)}${key === 'calories' ? ' kcal' : 'g'}`
                            : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveStep(1)}
              >
                Back to Ingredients
              </Button>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
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
    </>
  );
}