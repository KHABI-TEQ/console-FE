import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/forgot-password"];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Mock authentication check - in a real app, check JWT token or session
  const isAuthenticated = request.cookies.get("auth-token")?.value;

  // If user is authenticated and tries to access auth pages, redirect to admin
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is not authenticated and tries to access protected pages, redirect to login
  if (!isAuthenticated && !isPublicPath && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
