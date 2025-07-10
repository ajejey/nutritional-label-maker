import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('food-label-analytics');

    // Extract user ID and recipe from the request body
    const { userId, recipe } = body;
    
    // Log what we received for debugging
    console.log('Received recipe tracking request:', { userId, recipeData: recipe });
    
    // Validate the recipe data
    if (!recipe || typeof recipe !== 'object') {
      console.error('Invalid recipe data received:', recipe);
      return NextResponse.json(
        { error: 'Invalid recipe data' },
        { status: 400 }
      );
    }

    // Store recipe data with timestamp and user ID
    await db.collection('recipeTracking').insertOne({
      userId,
      recipe,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking recipe:', error);
    return NextResponse.json(
      { error: 'Failed to track recipe' },
      { status: 500 }
    );
  }
}
