import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

export async function GET(request: Request) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'ar';
  
  const { data: sections } = await supabase
    .from('nav_sections')
    .select('*');

  if (!sections || sections.length === 0) {
    return NextResponse.json({ sections: [] });
  }

  const { data: pages } = await supabase
    .from('nav_pages')
    .select('*');

  if (!pages || pages.length === 0) {
    return NextResponse.json({ sections: [] });
  }

  const pagesBySection = new Map<string, any[]>();
  
  for (const page of pages) {
    if (!page.section_key) continue;
    if (!pagesBySection.has(page.section_key)) {
      pagesBySection.set(page.section_key, []);
    }
    pagesBySection.get(page.section_key)!.push({
      id: page.id,
      name: locale === 'ar' && page.name_ar ? page.name_ar : page.name,
      path: page.route_path,
      icon: page.icon_key,
      sort_order: page.sort_order,
    });
  }

  const navSections = sections
    .map(section => ({
      id: section.id,
      name: locale === 'ar' && section.label_ar ? section.label_ar : section.label,
      code: section.section_key,
      icon: section.icon_key,
      sort_order: section.sort_order,
      pages: (pagesBySection.get(section.section_key) || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)),
    }))
    .filter((s: any) => s.pages.length > 0)
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

  return NextResponse.json({ sections: navSections });
}