'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTheme, useTranslation } from '@/ui/providers/ThemeProvider';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Pill, 
  DollarSign, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role_code: string | null;
  role_name: string | null;
}

interface NavSection {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  pages: NavPage[];
}

interface NavPage {
  id: string;
  name: string;
  path: string;
  icon: string | null;
}

const ICONS: Record<string, any> = {
  LayoutDashboard,
  Users,
  Stethoscope,
  Pill,
  DollarSign,
  Settings,
};

interface SidebarProps {
  user: User;
  navTree: {
    sections: NavSection[];
  };
}

export default function Sidebar({ user, navTree }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Get theme/locale from ThemeProvider context
  const { theme, locale, setTheme, setLocale } = useTheme();
  const t = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLocale = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/signout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const tree = navTree?.sections?.length > 0 ? navTree : { sections: [] };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-neutral-800 border-r border-neutral-700 transform transition-transform duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-emerald-400" />
              <span className="text-lg font-bold text-white">Alhemam</span>
            </div>
            <div className="mt-3 p-2 bg-neutral-700/50 rounded-lg">
              <p className="text-sm text-white font-medium">{user.full_name || user.email}</p>
              <p className="text-xs text-emerald-400">{user.role_name || user.role_code}</p>
            </div>
            
            {/* Theme & Language Toggles */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-neutral-300 transition-colors"
                title={theme === 'dark' ? 'Dark mode' : 'Light mode'}
              >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
              </button>
              <button
                onClick={toggleLocale}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-neutral-300 transition-colors"
                title={locale === 'ar' ? 'العربية' : 'English'}
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold">{locale === 'ar' ? 'ع' : 'EN'}</span>
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            {tree.sections.map((section) => {
              const IconComponent = ICONS[section.icon || 'LayoutDashboard'];
              const isExpanded = expandedSections.has(section.id);
              const hasPages = section.pages.length > 1;

              return (
                <div key={section.id} className="mb-1">
                  <button
                    onClick={() => hasPages && toggleSection(section.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="flex-1 text-left text-sm">{section.name}</span>
                    {hasPages && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                  
                  {hasPages && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {section.pages.map((page) => {
                        const PageIcon = ICONS[page.icon || 'LayoutDashboard'];
                        const isActive = pathname === page.path;
                        
                        return (
                          <Link
                            key={page.id}
                            href={page.path}
                            onClick={() => setMobileOpen(false)}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                              ${isActive 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}
                            `}
                          >
                            {PageIcon && <PageIcon className="w-4 h-4" />}
                            {page.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-2 border-t border-neutral-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
