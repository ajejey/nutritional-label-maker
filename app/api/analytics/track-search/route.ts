import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { MongoClient } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('food-label-analytics');

    // Extract user ID and search data from the request body
    const { userId, query, resultCount, selectedIngredient } = body;

    // Store search query data with timestamp and user ID
    await db.collection('searchQueries').insertOne({
      userId,
      query,
      resultCount,
      selectedIngredient,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking search query:', error);
    return NextResponse.json(
      { error: 'Failed to track search query' },
      { status: 500 }
    );
  }
}
