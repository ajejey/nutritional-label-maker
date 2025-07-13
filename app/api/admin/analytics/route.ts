import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/app/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const isAuthenticated = await checkAdminAuth(req);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const dataType = searchParams.get('dataType') || 'all';
    const period = searchParams.get('period') || '7days';
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('food-label-analytics');
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '24hours':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    // Prepare response data
    const responseData: any = {};
    
    // Fetch recipe tracking data
    if (dataType === 'all' || dataType === 'recipes') {
      // Get recipe counts
      const recipeCount = await db.collection('recipeTracking').countDocuments({
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      // Get unique user count for recipes
      const uniqueRecipeUsers = await db.collection('recipeTracking').distinct('userId', {
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      // Get most common ingredients
      const ingredientPipeline = [
        { $match: { 
          timestamp: { $gte: startDate, $lte: endDate },
          'recipe.ingredients': { $exists: true, $ne: null, $type: 'array', $not: { $size: 0 } }
        } },
        { $unwind: '$recipe.ingredients' },
        { $group: { _id: '$recipe.ingredients.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ];
      
      const topIngredients = await db.collection('recipeTracking')
        .aggregate(ingredientPipeline)
        .toArray();
      
      // Get average ingredients per recipe
      const avgIngredientsPipeline = [
        { $match: { 
          timestamp: { $gte: startDate, $lte: endDate },
          'recipe.ingredients': { $exists: true, $ne: null, $type: 'array' }
        } },
        { $project: { 
          ingredientCount: { 
            $cond: [
              { $isArray: '$recipe.ingredients' },
              { $size: '$recipe.ingredients' },
              0
            ]
          } 
        } },
        { $group: { _id: null, avgCount: { $avg: '$ingredientCount' } } }
      ];
      
      const avgIngredientsResult = await db.collection('recipeTracking')
        .aggregate(avgIngredientsPipeline)
        .toArray();
      
      const avgIngredientsPerRecipe = avgIngredientsResult.length > 0 
        ? avgIngredientsResult[0].avgCount 
        : 0;
      
      responseData.recipes = {
        count: recipeCount,
        uniqueUsers: uniqueRecipeUsers ? uniqueRecipeUsers.length : 0,
        topIngredients: topIngredients || [],
        avgIngredientsPerRecipe: avgIngredientsPerRecipe || 0
      };
    }
    
    // Fetch search query data
    if (dataType === 'all' || dataType === 'searches') {
      // Get search counts
      const searchCount = await db.collection('searchQueries').countDocuments({
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      // Get unique user count for searches
      const uniqueSearchUsers = await db.collection('searchQueries').distinct('userId', {
        timestamp: { $gte: startDate, $lte: endDate }
      });
      
      // Get top search queries
      const searchPipeline = [
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$query', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ];
      
      const topSearches = await db.collection('searchQueries')
        .aggregate(searchPipeline)
        .toArray();
      
      // Get selection rate (searches that resulted in an ingredient selection)
      const selectionPipeline = [
        { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
        { $group: { 
          _id: null, 
          totalSearches: { $sum: 1 },
          searchesWithSelection: { 
            $sum: { $cond: [{ $ifNull: ["$selectedIngredient", null] }, 1, 0] } 
          }
        }}
      ];
      
      const selectionResult = await db.collection('searchQueries')
        .aggregate(selectionPipeline)
        .toArray();
      
      const selectionRate = selectionResult.length > 0 
        ? selectionResult[0].searchesWithSelection / selectionResult[0].totalSearches 
        : 0;
      
      responseData.searches = {
        count: searchCount,
        uniqueUsers: uniqueSearchUsers ? uniqueSearchUsers.length : 0,
        topSearches: topSearches || [],
        selectionRate: selectionRate || 0
      };
    }
    
    // Get user activity over time (daily counts)
    if (dataType === 'all' || dataType === 'activity') {
      const activityPipeline = [
        { $match: { 
          timestamp: { $gte: startDate, $lte: endDate },
          userId: { $exists: true, $ne: null }
        } },
        { $project: { 
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          userId: 1
        }},
        { $group: { 
          _id: "$date", 
          uniqueUsers: { $addToSet: "$userId" },
          count: { $sum: 1 }
        }},
        { $project: {
          date: "$_id",
          uniqueUsers: { $cond: [{ $isArray: "$uniqueUsers" }, { $size: "$uniqueUsers" }, 0] },
          count: 1,
          _id: 0
        }},
        { $sort: { date: 1 } }
      ];
      
      const activityData = await db.collection('recipeTracking')
        .aggregate(activityPipeline)
        .toArray();
      
      responseData.activity = activityData;
    }
    
    // Get recent activity for both recipes and searches
    if (dataType === 'all' || dataType === 'recent') {
      // Get recent recipes
      const recentRecipes = await db.collection('recipeTracking')
        .find({ timestamp: { $gte: startDate, $lte: endDate } })
        .sort({ timestamp: -1 })
        .project({
          userId: 1,
          recipe: 1,  // Include the complete recipe object
          timestamp: 1,
          _id: 0
        })
        .toArray();
      
      // Get recent searches
      const recentSearches = await db.collection('searchQueries')
        .find({ timestamp: { $gte: startDate, $lte: endDate } })
        .sort({ timestamp: -1 })
        .project({
          userId: 1,
          query: 1,
          resultCount: 1,
          selectedIngredient: 1,
          timestamp: 1,
          _id: 0
        })
        .toArray();
        
      // Ensure we have valid data
      const processedRecentSearches = recentSearches.map(search => ({
        ...search,
        query: search.query || 'Unknown',
        resultCount: search.resultCount || 0,
        userId: search.userId || 'anonymous'
      }));
      
      responseData.recent = {
        recipes: recentRecipes || [],
        searches: processedRecentSearches || []
      };
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
