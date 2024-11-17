import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/blog/create', '/blog/edit'];
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const isAuthenticated = !!session;

    // console.log('Middleware - Session:', session?.value);
    // console.log('Middleware - Is Authenticated:', isAuthenticated);

    const path = request.nextUrl.pathname;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && authRoutes.includes(path)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated && protectedRoutes.some(route => path.startsWith(route))) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('from', path);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
};