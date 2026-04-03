import { NextResponse } from 'next/server';
import { buildNavTree } from '@/platform/nav-engine';
import { getSession } from '@/platform/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const navTree = await buildNavTree(session.user.id, session.user.role_code || 'guest');

    return NextResponse.json(navTree);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
