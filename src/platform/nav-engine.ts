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

  const { data: sections } = await supabase
    .from('nav_sections')
    .select('id, section_key, label, icon_key, sort_order')
    .eq('is_active', true)
    .order('sort_order');

  if (!sections) {
    return { sections: [] };
  }

  const sectionKeys = sections.map(s => s.section_key);
  
  const { data: allPages } = await supabase
    .from('nav_pages')
    .select('id, page_key, route_path, name, section_key, icon_key, sort_order, is_sidebar, is_active')
    .in('section_key', sectionKeys)
    .eq('is_active', true)
    .eq('is_sidebar', true);

  const pagesBySection = new Map<string, NavPage[]>();
  
  allPages?.forEach(page => {
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

  const navSections: NavSection[] = sections
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

  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}