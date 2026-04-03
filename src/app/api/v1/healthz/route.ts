import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

export async function GET() {
  try {
    const supabase = createServiceClient();
    
    const { count: pagesCount } = await supabase
      .from('nav_pages')
      .select('*', { count: 'exact', head: true });
    
    const { count: sectionsCount } = await supabase
      .from('nav_sections')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'ok',
      schema: 'driven',
      pages: pagesCount || 0,
      sections: sectionsCount || 0,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: String(error),
    }, { status: 500 });
  }
}
