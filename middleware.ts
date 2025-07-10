import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/blog/create', '/blog/edit'];
const authRoutes = ['/login'];
const adminRoutes = ['/admin/dashboard'];
const adminAuthRoutes = ['/admin/login'];

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const adminSession = request.cookies.get('admin_session');
    const isAuthenticated = !!session;
    const isAdminAuthenticated = !!adminSession && adminSession.value === process.env.ADMIN_SESSION_TOKEN;

    const path = request.nextUrl.pathname;

    // Handle admin routes
    if (path.startsWith('/admin')) {
        // Allow access to admin login page
        if (path === '/admin/login') {
            // If already authenticated as admin, redirect to admin dashboard
            if (isAdminAuthenticated) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return NextResponse.next();
        }
        
        // Protect admin dashboard and other admin routes
        if (!isAdminAuthenticated) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        
        return NextResponse.next();
    }

    // Handle regular app routes
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