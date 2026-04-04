'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/ui/providers/ThemeProvider';
import { useTranslation } from '@/i18n';
import { createClient } from '@supabase/supabase-js';
import { Users, Calendar, FileText, CreditCard, Building, BarChart, Settings, Key, Stethoscope, Shield } from 'lucide-react';

const iconMap: Record<string, any> = {
  Users, Calendar, FileText, CreditCard, Building, BarChart, Settings, Key, Stethoscope, Shield
};

interface ContentBlock {
  id: string;
  contentType: string;
  title: string;
  subtitle?: string;
  content?: Record<string, unknown>;
  config?: Record<string, unknown>;
  sortOrder: number;
}

interface PageSection {
  id: string;
  sectionKey: string;
  title: string;
  layout: string;
  config: Record<string, unknown>;
  sortOrder: number;
  content: ContentBlock[];
}

interface PageData {
  page: {
    key: string;
    name: string;
    routePath: string;
    iconKey: string;
  };
  sections: PageSection[];
}

export default function DynamicPage({ params }: { params: { pageKey: string[] } }) {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const key = params?.pageKey?.[0] || 'dashboard';
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    async function fetchPage() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        const locale = 'ar';

        const { data: page } = await supabase
          .from('nav_pages')
          .select('*')
          .eq('page_key', key)
          .single();

        if (!page) {
          setLoading(false);
          return;
        }

        const { data: sections } = await supabase
          .from('page_sections')
          .select('*')
          .eq('page_key', key)
          .eq('is_active', true)
          .order('sort_order');

        const { data: blocks } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_key', key)
          .eq('is_active', true)
          .order('sort_order');

        const bySection = new Map<string, ContentBlock[]>();
        (blocks || []).forEach((block: any) => {
          const sk = block.section_key || 'main';
          if (!bySection.has(sk)) bySection.set(sk, []);
          bySection.get(sk)!.push({
            id: block.id,
            contentType: block.content_type,
            title: locale === 'ar' && block.title_ar ? block.title_ar : block.title,
            subtitle: locale === 'ar' && block.subtitle_ar ? block.subtitle_ar : block.subtitle,
            content: locale === 'ar' && block.content_ar ? block.content_ar : block.content,
            config: block.config,
            sortOrder: block.sort_order,
          });
        });

        const pageSections: PageSection[] = (sections || []).map((s: any) => ({
          id: s.id,
          sectionKey: s.section_key,
          title: locale === 'ar' && s.title_ar ? s.title_ar : s.title,
          layout: s.layout || 'grid',
          config: s.config,
          sortOrder: s.sort_order,
          content: bySection.get(s.section_key) || [],
        }));

        setData({
          page: {
            key: page.page_key,
            name: locale === 'ar' && page.name_ar ? page.name_ar : page.name,
            routePath: page.route_path,
            iconKey: page.icon_key,
          },
          sections: pageSections,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [key]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-gray-100'}`}>
        <div className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('common.loading')}</div>
      </div>
    );
  }

  if (!data || !data.page) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-gray-100'}`}>
        <div className="text-emerald-500 text-2xl font-bold">{key}</div>
      </div>
    );
  }

  const IconComponent = data.page.iconKey ? iconMap[data.page.iconKey] || iconMap.Shield : iconMap.Shield;

  const renderBlock = (block: ContentBlock) => {
    const isDarkTheme = isDark;

    switch (block.contentType) {
      case 'stat':
        const statContent = block.content as { value?: string; trend?: string } | null;
        return (
          <div key={block.id} className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkTheme ? 'text-neutral-400' : 'text-gray-500'}`}>{block.title}</p>
                <p className={`text-3xl font-bold mt-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  {statContent?.value || '—'}
                </p>
              </div>
              <div className={`text-sm ${statContent?.trend?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {statContent?.trend || ''}
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div key={block.id} className="mb-8">
            <h1 className={`text-4xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {block.title}
            </h1>
            {block.subtitle && (
              <p className={`text-xl mt-2 ${isDarkTheme ? 'text-neutral-400' : 'text-gray-600'}`}>
                {block.subtitle}
              </p>
            )}
          </div>
        );

      case 'card':
      default:
        return (
          <div key={block.id} className={`p-6 rounded-xl border ${isDarkTheme ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'} mb-2`}>
              {block.title}
            </h3>
            <p className={isDarkTheme ? 'text-neutral-400' : 'text-gray-600'}>{block.subtitle}</p>
          </div>
        );
    }
  };

  const gridClass = (layout: string) => {
    switch (layout) {
      case 'grid': return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      case 'columns': return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'full': return '';
      default: return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-900' : 'bg-gray-50'} p-6`}>
      <div className="flex items-center gap-3 mb-8">
        {IconComponent && <IconComponent className="w-8 h-8 text-emerald-500" />}
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {data.page.name}
        </h1>
      </div>

      {data.sections.map((section) => (
        <section key={section.id} className="mb-8">
          {section.title && (
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {section.title}
            </h2>
          )}
          <div className={gridClass(section.layout)}>
            {section.content.map(renderBlock)}
          </div>
        </section>
      ))}
    </div>
  );
}