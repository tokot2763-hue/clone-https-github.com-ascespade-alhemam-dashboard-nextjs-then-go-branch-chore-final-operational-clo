import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

const PUBLIC_PATHS = ['/', '/login', '/_next', '/favicon.ico', '/api/v1/auth/signin', '/api/v1/healthz'];

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Max requests per window

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

async function validateSession(token: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const supabase = createServiceClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && !!user;
  } catch {
    return false;
  }
}

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientId = getClientId(request);
  
  // Rate limiting for auth endpoints
  if (pathname === '/api/v1/auth/signin') {
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }
  
  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith('/_next'))) {
    return NextResponse.next();
  }
  
  // Check for API routes that need auth
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/v1/healthz') {
      return NextResponse.next();
    }
    
    const token = request.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isValid = await validateSession(token);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    return NextResponse.next();
  }
  
  // For page routes, require auth
  const sessionToken = request.cookies.get('sb-access-token')?.value;
  
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const isValid = await validateSession(sessionToken);
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};