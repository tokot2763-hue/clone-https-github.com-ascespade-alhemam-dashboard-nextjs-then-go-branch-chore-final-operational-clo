import { NextResponse } from 'next/server';
import { buildNavTree } from '@/platform/nav-engine';

export async function GET() {
  try {
    const navTree = await buildNavTree('test-user-id', 'admin');
    return NextResponse.json({
      navTree,
      sectionCount: navTree.sections.length,
      sections: navTree.sections.map(s => ({
        name: s.name,
        pageCount: s.pages.length,
        pages: s.pages.slice(0, 3).map(p => p.name)
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}