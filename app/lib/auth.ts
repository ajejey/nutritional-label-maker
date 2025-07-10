import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple authentication middleware for admin routes
export async function checkAdminAuth(req: NextRequest) {
  // Check if user has a valid admin session cookie
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  
  if (adminSession?.value === process.env.ADMIN_SESSION_TOKEN) {
    return true;
  }
  
  return false;
}

// Function to validate admin credentials
export async function validateAdminCredentials(username: string, password: string) {
  // Compare with environment variables
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  
  if (!validUsername || !validPassword) {
    console.error('Admin credentials not configured in environment variables');
    return false;
  }
  
  return username === validUsername && password === validPassword;
}

// Function to create admin session
export async function createAdminSession() {
  // Create a session token (in a real app, this would be more secure)
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  
  if (!sessionToken) {
    console.error('Admin session token not configured in environment variables');
    return null;
  }
  
  // Set cookie with the session token
  cookies().set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return sessionToken;
}

// Function to clear admin session
export async function clearAdminSession() {
  cookies().delete('admin_session');
}
