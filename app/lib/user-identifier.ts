/**
 * Utility functions for identifying users for analytics purposes
 */

import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Cookie name for anonymous user ID
const ANONYMOUS_ID_COOKIE = 'food_label_anonymous_id';

/**
 * Get the current user ID - either from authentication or an anonymous ID
 * This is a server-side function
 */
export async function getUserId(req: Request): Promise<string> {
  // Check if we have an authenticated user
  // This would depend on your authentication system
  // For example with NextAuth:
  // const session = await getServerSession(authOptions);
  // if (session?.user?.id) return session.user.id;
  
  // If no authenticated user, use or create an anonymous ID
  const cookieStore = cookies();
  let anonymousId = cookieStore.get(ANONYMOUS_ID_COOKIE)?.value;
  
  if (!anonymousId) {
    // Generate a new anonymous ID
    anonymousId = uuidv4();
    
    // Set the cookie with a long expiration (1 year)
    cookieStore.set(ANONYMOUS_ID_COOKIE, anonymousId, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  return anonymousId;
}

/**
 * Get the current user ID on the client side
 * This uses localStorage for anonymous users
 */
export function getClientUserId(): string {
  // Check if we're in the browser
  if (typeof window === 'undefined') return '';
  
  // Check if we have an authenticated user
  // This would depend on your authentication system
  // For example with NextAuth:
  // const session = useSession();
  // if (session?.data?.user?.id) return session.data.user.id;
  
  // If no authenticated user, use or create an anonymous ID in localStorage
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_COOKIE);
  
  if (!anonymousId) {
    // Generate a new anonymous ID
    anonymousId = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_COOKIE, anonymousId);
  }
  
  return anonymousId;
}
