import { Recipe } from "../types/recipe";

export interface SavedRecipe {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
  data: {
    recipe: Recipe;
    activeStep: number;
  };
}

const STORAGE_KEYS = {
  CURRENT_RECIPE: 'food-label-maker-current-recipe',
  SAVED_RECIPES: 'food-label-maker-saved-recipes',
};

/**
 * Checks if a recipe has been modified from default values
 */
const isRecipeModified = (recipe: Recipe): boolean => {
  // Check if recipe has any ingredients
  if (recipe.ingredients.length > 0) return true;
  
  // Check if recipe name has been changed from default
  if (recipe.name !== 'My Recipe' && recipe.name !== 'New Recipe') return true;
  
  // Check if serving size or servings per container have been modified
  if (recipe.servingSize !== 100) return true;
  if (recipe.servingsPerContainer !== 1) return true;
  
  // If none of the above conditions are met, recipe is unmodified
  return false;
};

/**
 * Saves the current recipe state to local storage
 */
export const saveCurrentRecipe = (recipe: Recipe, activeStep: number): void => {
  try {
    // Always save to current recipe slot
    const currentRecipe: SavedRecipe = {
      id: recipe.id || `recipe-${Date.now()}`,
      name: recipe.name || 'Untitled Recipe',
      createdAt: Date.now(),
      lastModified: Date.now(),
      data: {
        recipe: {
          ...recipe,
          id: recipe.id || `recipe-${Date.now()}`,
        },
        activeStep,
      },
    };
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_RECIPE, JSON.stringify(currentRecipe));
    
    // Only add to saved recipes list if the recipe has been modified
    if (isRecipeModified(recipe)) {
      const savedRecipes = getSavedRecipes();
      const existingIndex = savedRecipes.findIndex(r => r.id === currentRecipe.id);
      
      if (existingIndex >= 0) {
        savedRecipes[existingIndex] = currentRecipe;
      } else {
        savedRecipes.push(currentRecipe);
      }
      
      localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
    }
    
    return;
  } catch (error) {
    console.error('Failed to save recipe to local storage:', error);
  }
};

/**
 * Retrieves the current recipe from local storage
 */
export const getCurrentRecipe = (): SavedRecipe | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.CURRENT_RECIPE);
    if (!savedData) return null;
    
    return JSON.parse(savedData) as SavedRecipe;
  } catch (error) {
    console.error('Failed to retrieve current recipe from local storage:', error);
    return null;
  }
};

/**
 * Gets all saved recipes from local storage
 */
export const getSavedRecipes = (): SavedRecipe[] => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
    if (!savedData) return [];
    
    return JSON.parse(savedData) as SavedRecipe[];
  } catch (error) {
    console.error('Failed to retrieve saved recipes from local storage:', error);
    return [];
  }
};

/**
 * Loads a specific saved recipe by ID
 */
export const loadRecipe = (recipeId: string): SavedRecipe | null => {
  try {
    const savedRecipes = getSavedRecipes();
    const recipe = savedRecipes.find(r => r.id === recipeId);
    
    if (recipe) {
      // Update current recipe
      localStorage.setItem(STORAGE_KEYS.CURRENT_RECIPE, JSON.stringify(recipe));
      return recipe;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load recipe from local storage:', error);
    return null;
  }
};

/**
 * Deletes a saved recipe by ID
 */
export const deleteRecipe = (recipeId: string): boolean => {
  try {
    const savedRecipes = getSavedRecipes();
    const filteredRecipes = savedRecipes.filter(r => r.id !== recipeId);
    
    localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(filteredRecipes));
    
    // If current recipe is deleted, clear it
    const currentRecipe = getCurrentRecipe();
    if (currentRecipe && currentRecipe.id === recipeId) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RECIPE);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete recipe from local storage:', error);
    return false;
  }
};

/**
 * Creates a new empty recipe
 */
export const createNewRecipe = (): SavedRecipe => {
  const newRecipe: SavedRecipe = {
    id: `recipe-${Date.now()}`,
    name: 'New Recipe',
    createdAt: Date.now(),
    lastModified: Date.now(),
    data: {
      recipe: {
        id: `recipe-${Date.now()}`,
        name: 'New Recipe',
        servingSize: 100,
        servingUnit: 'g',
        servingsPerContainer: 1,
        ingredients: [],
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
        }
      },
      activeStep: 1,
    },
  };
  
  // Only save to current recipe slot in local storage
  // Don't add to saved recipes list until user makes changes
  localStorage.setItem(STORAGE_KEYS.CURRENT_RECIPE, JSON.stringify(newRecipe));
  
  return newRecipe;
};
