import { createServerClient } from './supabase-server';

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
  const supabase = await createServerClient();

  // nav_sections has: name, code, icon
  // nav_pages has: section_id (FK), name, path, icon
  // Use nested select to join pages to sections
  const { data: sectionsWithPages } = await supabase
    .from('nav_sections')
    .select(`
      id,
      name,
      code,
      icon,
      sort_order,
      nav_pages (
        id,
        name,
        path,
        icon,
        sort_order,
        is_active
      )
    `)
    .eq('is_active', true)
    .order('sort_order');

  if (!sectionsWithPages) {
    return { sections: [] };
  }

  const navSections: NavSection[] = sectionsWithPages
    .filter((s: any) => s.nav_pages && s.nav_pages.length > 0)
    .map((section: any) => ({
      id: section.id,
      name: section.name,
      code: section.code,
      icon: section.icon,
      sort_order: section.sort_order,
      pages: section.nav_pages
        .filter((p: any) => p.is_active !== false)
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((page: any) => ({
          id: page.id,
          name: page.name,
          path: page.path,
          icon: page.icon,
          sort_order: page.sort_order,
        })),
    }))
    .filter((s: any) => s.pages.length > 0);

  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}