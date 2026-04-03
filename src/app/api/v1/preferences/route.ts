import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServiceClient } from '@/platform/supabase-server';

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;
  
  if (!token) return null;
  
  try {
    const supabase = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser(token);
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { userId, theme, locale } = body;

    if (!userId || userId !== currentUserId) {
      return NextResponse.json({ error: 'Cannot modify other user preferences' }, { status: 403 });
    }

    // Validate inputs
    const validThemes = ['dark', 'light', 'system'];
    const validLocales = ['ar', 'en'];
    
    if (theme && !validThemes.includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
    }
    
    if (locale && !validLocales.includes(locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  // Return default preferences - public
  return NextResponse.json({
    theme: 'system',
    locale: 'ar',
  });
}