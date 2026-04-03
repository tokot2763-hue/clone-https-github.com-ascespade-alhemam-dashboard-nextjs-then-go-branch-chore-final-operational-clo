import { NextResponse } from 'next/server';
import { buildNavTree } from '@/platform/nav-engine';

export async function GET() {
  try {
    const navTree = await buildNavTree('test-user', 'admin');
    return NextResponse.json({
      sectionCount: navTree.sections.length,
      sections: navTree.sections.map(s => ({ name: s.name, pageCount: s.pages.length })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}