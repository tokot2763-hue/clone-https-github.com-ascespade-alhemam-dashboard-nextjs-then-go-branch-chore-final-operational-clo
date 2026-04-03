'use client';

import { useState, useEffect } from 'react';
import { Navigation, Loader2, Search, Plus, ChevronDown, ChevronRight, Settings } from 'lucide-react';

interface NavPage {
  id: string;
  section_key: string;
  name: string;
  route_path: string;
  is_active: boolean;
  is_sidebar: boolean;
  icon_key: string;
  sort_order: number;
}

interface NavSection {
  id: string;
  section_key: string;
  label: string;
  is_active: boolean;
  sort_order: number;
}

export default function AdminNavigationPage() {
  const [sections, setSections] = useState<NavSection[]>([]);
  const [pages, setPages] = useState<NavPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('admin');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/nav');
      const data = await res.json();
      setSections(data.sections || []);
      // Get pages separately
      const pagesRes = await fetch('https://xjcxsdoblqckxafvzqsa.supabase.co/rest/v1/nav_pages?select=*', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3MTI3NCwiZXhwIjoyMDkwNzQ3Mjc0fQ.gzHKDlEZdITkEHoAoJflTl8MmFODGuRLMuZUqWgB5eA',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqY3hzZG9ibHFja3hhZnZ6cXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE3MTI3NCwiZXhwIjoyMDkwNzQ3Mjc0fQ.gzHKDlEZdITkEHoAoJflTl8MmFODGuRLMuZUqWgB5eA'
        }
      });
      const pagesData = await pagesRes.json();
      setPages(pagesData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const getPagesForSection = (sectionKey: string) => 
    pages.filter(p => p.section_key === sectionKey);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Navigation Management</h1>
            <p className="text-neutral-400">{sections.length} sections, {pages.length} pages</p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => {
            const sectionPages = getPagesForSection(section.section_key);
            const isExpanded = expandedSection === section.section_key;
            
            return (
              <div key={section.id} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.section_key)}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-700/50"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    )}
                    <div className="text-left">
                      <h3 className="text-white font-medium">{section.label}</h3>
                      <p className="text-neutral-400 text-sm">Key: {section.section_key}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-sm rounded">
                    {sectionPages.length} pages
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="border-t border-neutral-700">
                    <table className="w-full">
                      <thead className="bg-neutral-700/30">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-400">Page Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-400">Route</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-neutral-400">Icon</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-neutral-400">Sort</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-700">
                        {sectionPages.map((page) => (
                          <tr key={page.id} className="hover:bg-neutral-700/20">
                            <td className="px-4 py-2 text-white">{page.name}</td>
                            <td className="px-4 py-2 text-neutral-400 font-mono text-sm">{page.route_path}</td>
                            <td className="px-4 py-2 text-neutral-400">{page.icon_key || '-'}</td>
                            <td className="px-4 py-2 text-center text-neutral-400">{page.sort_order}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-2">ℹ️ How to Add Pages</h3>
          <p className="text-neutral-400 text-sm">
            Add new pages directly in the Supabase database:<br/>
            1. Go to <code className="bg-neutral-700 px-2 py-0.5 rounded">nav_sections</code> table<br/>
            2. Go to <code className="bg-neutral-700 px-2 py-0.5 rounded">nav_pages</code> table<br/>
            3. Add new rows with section_key, name, route_path, icon_key, sort_order
          </p>
        </div>
      </div>
    </div>
  );
}