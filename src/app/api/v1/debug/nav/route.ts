import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

export async function GET() {
  const supabase = createServiceClient();
  
  const { data: sections, error: sectionsError } = await supabase
    .from('nav_sections')
    .select('*');
  
  const { data: pages, error: pagesError } = await supabase
    .from('nav_pages')
    .select('*');
  
  return NextResponse.json({
    sections: sections?.length || 0,
    sectionsError: sectionsError ? String(sectionsError) : null,
    sectionsData: sections?.slice(0, 3),
    pages: pages?.length || 0,
    pagesError: pagesError ? String(pagesError) : null,
    pagesData: pages?.slice(0, 3),
  });
}