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

  const { data: allSections, error: sectionsError } = await supabase
    .from('nav_sections')
    .select('id, section_key, label, icon_key, sort_order')
    .order('sort_order');

  console.log('nav-engine: sections query:', { count: allSections?.length, error: sectionsError });

  if (!allSections || allSections.length === 0) {
    return { sections: [] };
  }

  const { data: pages, error: pagesError } = await supabase
    .from('nav_pages')
    .select('id, page_key, route_path, name, section_key, icon_key, sort_order');

  console.log('nav-engine: pages query:', { count: pages?.length, error: pagesError });

  if (!pages || pages.length === 0) {
    return { sections: [] };
  }

  const pagesBySection = new Map<string, NavPage[]>();
  
  pages.forEach(page => {
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
  });

  const navSections: NavSection[] = allSections
    .map(section => ({
      id: section.id,
      name: section.label,
      code: section.section_key,
      icon: section.icon_key,
      sort_order: section.sort_order,
      pages: (pagesBySection.get(section.section_key) || [])
        .sort((a, b) => a.sort_order - b.sort_order),
    }))
    .filter(s => s.pages.length > 0);

  console.log('nav-engine: returning sections:', navSections.length);
  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}