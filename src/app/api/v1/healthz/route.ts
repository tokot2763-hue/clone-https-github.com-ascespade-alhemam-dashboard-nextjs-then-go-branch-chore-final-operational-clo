import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

export async function GET() {
  try {
    const supabase = createServiceClient();
    
    const { data: pages, count: pagesCount, error: pagesError } = await supabase
      .from('nav_pages')
      .select('*', { count: 'exact', head: true });
    
    const { data: sections, count: sectionsCount, error: sectionsError } = await supabase
      .from('nav_sections')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'ok',
      schema: 'driven',
      pages: pagesCount || 0,
      sections: sectionsCount || 0,
      pagesError: pagesError ? String(pagesError) : null,
      sectionsError: sectionsError ? String(sectionsError) : null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: String(error),
    }, { status: 500 });
  }
}
