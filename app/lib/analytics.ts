import { Recipe } from '../types/recipe';
import { v4 as uuidv4 } from 'uuid';

// Cookie name for anonymous user ID
const ANONYMOUS_ID_COOKIE = 'food_label_user_id';

/**
 * Get or create a user ID for analytics tracking
 */
export function getUserId(): string {
  // Check if we're in the browser
  if (typeof window === 'undefined') return '';
  
  // Try to get existing user ID from cookie
  let userId = localStorage.getItem(ANONYMOUS_ID_COOKIE);
  
  // If no user ID exists, create one
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_COOKIE, userId);
  }
  
  return userId;
}

/**
 * Track a recipe in MongoDB
 */
export const trackRecipe = (recipe: Recipe) => {
  // Use a non-blocking approach with setTimeout to ensure UI is not affected
  setTimeout(() => {
    try {
      const userId = getUserId();

      // Check if recipe is valid
      if (!recipe || !recipe.name || !recipe.ingredients || !Array.isArray(recipe.ingredients)) {
        console.error('Invalid recipe data:', recipe);
        return;
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
      
      // Use navigator.sendBeacon if available for more reliable background tracking
      // that won't block the main thread or be canceled if the page unloads
      if (navigator.sendBeacon) {
        const blob = new Blob([
          JSON.stringify({
            userId,
            recipe: simplifiedRecipe
          })
        ], { type: 'application/json' });
        
        const success = navigator.sendBeacon('/api/analytics/track-recipe', blob);
        if (!success) {
          // Fall back to fetch if sendBeacon fails
          sendWithFetch(userId, simplifiedRecipe);
        }
      } else {
        // Fall back to fetch for browsers that don't support sendBeacon
        sendWithFetch(userId, simplifiedRecipe);
      }
    } catch (error) {
      console.error('Error tracking recipe:', error);
    }
  }, 0); // Execute on next event loop tick
};

// Helper function to send tracking data with fetch
const sendWithFetch = (userId: string, simplifiedRecipe: any) => {
  fetch('/api/analytics/track-recipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      recipe: simplifiedRecipe
    }),
    // Use these options to make the request non-blocking
    keepalive: true
  }).catch(error => {
    console.error('Failed to track recipe:', error);
  });
};

/**
 * Track a search query in MongoDB
 */
export const trackSearchQuery = (query: string, resultCount: number, selectedIngredient?: any) => {
  // Use a non-blocking approach with setTimeout to ensure UI is not affected
  setTimeout(() => {
    try {
      const userId = getUserId();
      
      // Use navigator.sendBeacon if available for more reliable background tracking
      if (navigator.sendBeacon) {
        const blob = new Blob([
          JSON.stringify({
            userId,
            query,
            resultCount,
            selectedIngredient
          })
        ], { type: 'application/json' });
        
        const success = navigator.sendBeacon('/api/analytics/track-search', blob);
        if (!success) {
          // Fall back to fetch if sendBeacon fails
          sendSearchWithFetch(userId, query, resultCount, selectedIngredient);
        }
      } else {
        // Fall back to fetch for browsers that don't support sendBeacon
        sendSearchWithFetch(userId, query, resultCount, selectedIngredient);
      }
    } catch (error) {
      console.error('Error tracking search query:', error);
    }
  }, 0); // Execute on next event loop tick
};

// Helper function to send search tracking data with fetch
const sendSearchWithFetch = (userId: string, query: string, resultCount: number, selectedIngredient?: any) => {
  fetch('/api/analytics/track-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      query,
      resultCount,
      selectedIngredient
    }),
    // Use these options to make the request non-blocking
    keepalive: true
  }).catch(error => {
    console.error('Failed to track search query:', error);
  });
};
