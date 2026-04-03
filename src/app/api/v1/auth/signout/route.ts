import { NextResponse } from 'next/server';
import { createServerClient } from '@/platform/supabase-server';

export async function POST() {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();

    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
