import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
