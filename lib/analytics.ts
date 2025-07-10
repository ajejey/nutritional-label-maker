import { Recipe } from '../app/types/recipe';
import { v4 as uuidv4 } from 'uuid';

/**
 * Track a recipe in MongoDB
 */
export const trackRecipe = async (recipe: Recipe) => {
  try {
    // Get or create a user ID for tracking
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('analytics_user_id', userId);
    }

    // Create a simplified version of the recipe to ensure it can be serialized properly
    const simplifiedRecipe = {
      name: recipe.name,
      servingSize: recipe.servingSize,
      servingUnit: recipe.servingUnit,
      servingsPerContainer: recipe.servingsPerContainer,
      ingredients: recipe.ingredients.map(ingredient => ({
        fdcId: ingredient.fdcId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      }))
    };

    console.log('Tracking recipe:', simplifiedRecipe);

    const response = await fetch('/api/analytics/track-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        recipe: simplifiedRecipe
      })
    });
    
    if (!response.ok) {
      console.error('Failed to track recipe');
    }
  } catch (error) {
    console.error('Error tracking recipe:', error);
  }
};

/**
 * Track a search query in MongoDB
 */
export const trackSearchQuery = async (query: string, resultCount: number, selectedIngredient?: { fdcId: number, name: string }) => {
  try {
    const response = await fetch('/api/analytics/track-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        resultCount,
        selectedIngredient
      })
    });
    
    if (!response.ok) {
      console.error('Failed to track search query');
    }
  } catch (error) {
    console.error('Error tracking search query:', error);
  }
};
