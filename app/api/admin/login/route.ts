import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminSession } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Validate credentials
    const isValid = await validateAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = await createAdminSession();

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
