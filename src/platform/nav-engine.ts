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

  // Use head:true with count like healthz - this pattern works in CF workers
  const { data: sectionsData, count: sectionsCount, error: sectionsError } = await supabase
    .from('nav_sections')
    .select('*', { count: 'exact', head: true });

  console.log('nav-engine: sections:', { count: sectionsCount, error: sectionsError });

  if (!sectionsCount || sectionsCount === 0) {
    return { sections: [] };
  }

  const { data: pagesData, count: pagesCount, error: pagesError } = await supabase
    .from('nav_pages')
    .select('*', { count: 'exact', head: true });

  console.log('nav-engine: pages:', { count: pagesCount, error: pagesError });

  if (!pagesCount || pagesCount === 0) {
    return { sections: [] };
  }

  // If we have counts, fetch actual data
  const { data: allSections } = await supabase
    .from('nav_sections')
    .select('id, section_key, label, icon_key, sort_order');

  const { data: pages } = await supabase
    .from('nav_pages')
    .select('id, page_key, route_path, name, section_key, icon_key, sort_order');

  if (!allSections || !pages) {
    return { sections: [] };
  }

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

  const navSections: NavSection[] = allSections
    .map(section => ({
      id: section.id,
      name: section.label,
      code: section.section_key,
      icon: section.icon_key,
      sort_order: section.sort_order,
      pages: (pagesBySection.get(section.section_key) || [])
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }))
    .filter(s => s.pages.length > 0)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}