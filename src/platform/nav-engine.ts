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
  const supabase = createServerClient();

  const { data: sections } = await supabase
    .from('nav_sections')
    .select(`
      id,
      name,
      code,
      icon,
      sort_order
    `)
    .eq('is_active', true)
    .order('sort_order');

  if (!sections) {
    return { sections: [] };
  }

  const { data: pageRoles } = await supabase
    .from('nav_page_roles')
    .select(`
      can_view,
      nav_pages (
        id,
        name,
        path,
        icon,
        sort_order,
        section_id
      )
    `)
    .eq('can_view', true);

  const { data: role } = await supabase
    .from('iam_roles')
    .select('id')
    .eq('code', roleCode)
    .single();

  const allowedPageIds = new Set(
    pageRoles
      ?.filter(pr => pr.nav_pages)
      .map(pr => (pr.nav_pages as any).id)
  );

  const pagesBySection = new Map<string, NavPage[]>();
  
  pageRoles?.forEach(pr => {
    if (!pr.nav_pages) return;
    const page = pr.nav_pages as any;
    if (!pagesBySection.has(page.section_id)) {
      pagesBySection.set(page.section_id, []);
    }
    pagesBySection.get(page.section_id)!.push({
      id: page.id,
      name: page.name,
      path: page.path,
      icon: page.icon,
      sort_order: page.sort_order,
    });
  });

  const navSections: NavSection[] = sections.map(section => ({
    id: section.id,
    name: section.name,
    code: section.code,
    icon: section.icon,
    sort_order: section.sort_order,
    pages: (pagesBySection.get(section.id) || [])
      .sort((a, b) => a.sort_order - b.sort_order)
  })).filter(s => s.pages.length > 0);

  return { sections: navSections };
}

export async function getUserPages(userId: string, roleCode: string) {
  const navTree = await buildNavTree(userId, roleCode);
  return navTree.sections.flatMap(s => s.pages);
}
