import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isApi = request.nextUrl.pathname.startsWith('/api');
  const isRoot = request.nextUrl.pathname === '/';
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // Allow these paths
  if (isRoot || isAuthPage || isApi) {
    return NextResponse.next();
  }

  // Temporarily allow dashboard without auth for testing
  if (isDashboard) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
