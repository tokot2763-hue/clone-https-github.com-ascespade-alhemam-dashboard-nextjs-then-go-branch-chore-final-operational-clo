import { NextResponse } from 'next/server';
import { createServiceClient, updateUserPreferences } from '@/platform/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, theme, locale } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const success = await updateUserPreferences(userId, { theme, locale });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  // Return default preferences
  return NextResponse.json({
    theme: 'dark',
    locale: 'ar',
  });
}