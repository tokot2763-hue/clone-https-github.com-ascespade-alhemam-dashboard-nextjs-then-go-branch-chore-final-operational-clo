import { createServiceClient } from './supabase-server';

export interface NavSection {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  sort_order: number;
  pages: NavPage[];
}

export interface NavPage {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  sort_order: number;
}

export interface NavTree {
  sections: NavSection[];
}

export async function buildNavTree(userId: string, roleCode: string): Promise<NavTree> {
  const supabase = createServiceClient();

  // Get ALL sections - let RLS filter if needed
  const { data: allSections, error: sectionsError } = await supabase
    .from('nav_sections')
    .select('id, section_key, label, icon_key, sort_order');

  console.log('nav-engine: sections query:', { count: allSections?.length, error: sectionsError });

  if (!allSections || allSections.length === 0) {
    console.log('nav-engine: no sections found');
    return { sections: [] };
  }

  const sectionKeys = allSections.map(s => s.section_key);

  // Get ALL pages - let RLS filter if needed  
  const { data: pages, error: pagesError } = await supabase
    .from('nav_pages')
    .select('id, page_key, route_path, name, section_key, icon_key, sort_order')
    .in('section_key', sectionKeys);

  console.log('nav-engine: pages query:', { count: pages?.length, error: pagesError });

  if (!pages || pages.length === 0) {
    console.log('nav-engine: no pages found');
    return { sections: [] };
  }

  // Group pages by section_key
  const pagesBySection = new Map<string, NavPage[]>();
  
  for (const page of pages) {
    if (!page.section_key) continue;
    if (!pagesBySection.has(page.section_key)) {
      pagesBySection.set(page.section_key, []);
    }
    pagesBySection.get(page.section_key)!.push({
      id: page.id,
      name: page.name,
      path: page.route_path,
      icon: page.icon_key,
      sort_order: page.sort_order,
    });
  }

  // Build sections with their pages, sorted by sort_order
  const navSections: NavSection[] = allSections
    .map(section => {
      const sectionKey = section.section_key;
      const sectionPages = (pagesBySection.get(sectionKey) || [])
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return {
        id: section.id,
        name: section.label,
        code: sectionKey,
        icon: section.icon_key,
        sort_order: section.sort_order,
        pages: sectionPages,
      };
    })
    .filter(s => s.pages.length > 0) // Keep only sections with pages - dynamic DB filtering
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  console.log('nav-engine: returning sections:', navSections.length, 'with pages:', navSections.map(s => `${s.name}: ${s.pages.length}`).join(', '));
  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}