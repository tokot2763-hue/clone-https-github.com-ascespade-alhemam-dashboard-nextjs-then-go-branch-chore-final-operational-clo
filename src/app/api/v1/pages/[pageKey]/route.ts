import { NextResponse } from 'next/server';
import { createServiceClient } from '@/platform/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  const { pageKey } = await params;
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'ar';

  // Get page metadata
  const { data: page } = await supabase
    .from('nav_pages')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .single();

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  // Get sections with content blocks
  const { data: sections } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .order('sort_order');

  // Get content blocks for each section
  const { data: contentBlocks } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_active', true)
    .order('sort_order');

  // Group content blocks by section
  const contentBySection = new Map<string, any[]>();
  if (contentBlocks) {
    for (const block of contentBlocks) {
      const sectionKey = block.section_key || 'main';
      if (!contentBySection.has(sectionKey)) {
        contentBySection.set(sectionKey, []);
      }
      contentBySection.get(sectionKey)!.push({
        id: block.id,
        contentType: block.content_type,
        title: locale === 'ar' && block.title_ar ? block.title_ar : block.title,
        subtitle: locale === 'ar' && block.subtitle_ar ? block.subtitle_ar : block.subtitle,
        content: locale === 'ar' && block.content_ar ? block.content_ar : block.content,
        config: block.config,
        sortOrder: block.sort_order,
      });
    }
  }

  // Build sections with content
  const pageSections = (sections || []).map((section: any) => ({
    id: section.id,
    sectionKey: section.section_key,
    title: locale === 'ar' && section.title_ar ? section.title_ar : section.title,
    layout: section.layout,
    config: section.config,
    sortOrder: section.sort_order,
    content: contentBySection.get(section.section_key) || [],
  }));

  // Get page template
  const { data: template } = await supabase
    .from('page_templates')
    .select('*')
    .eq('template_key', page.template_key || 'list')
    .single();

  return NextResponse.json({
    page: {
      key: page.page_key,
      name: locale === 'ar' && page.name_ar ? page.name_ar : page.name,
      routePath: page.route_path,
      iconKey: page.icon_key,
      template: template,
    },
    sections: pageSections,
    locale,
  });
}