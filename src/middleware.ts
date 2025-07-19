import { NextRequest, NextResponse } from 'next/server';
import { decodeJWT, validateJWTStructure } from './lib/edge-jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login'];
  
  // Admin routes that require admin role
  const adminRoutes = ['/admin'];
  
  // Protected routes that require authentication (user or admin)
  const protectedRoutes = ['/home', '/courses', '/notifications'];

  // Skip middleware for public routes and API routes (handled separately)
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // No token found, redirect to login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify token
    const decoded = decodeJWT(token);
    
    if (!decoded || !validateJWTStructure(decoded)) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('token'); // Clear invalid token
      return response;
    }

    const user = decoded;

    // Check admin routes
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (user.role !== 'admin') {
        // Not an admin, redirect to user dashboard
        const homeUrl = new URL('/home', request.url);
        return NextResponse.redirect(homeUrl);
      }
    }

    // Check if student is trying to access admin routes
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      const homeUrl = new URL('/home', request.url);
      return NextResponse.redirect(homeUrl);
    }

    // Check if admin is trying to access student routes
    if (protectedRoutes.includes(pathname) && user.role === 'admin') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }

    // All checks passed, allow access
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Error verifying token, redirect to login
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token'); // Clear invalid token
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - icons (PWA icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons).*)',
  ],
};
