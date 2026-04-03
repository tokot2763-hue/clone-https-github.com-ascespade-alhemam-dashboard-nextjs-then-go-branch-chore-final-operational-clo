import { getSession } from '@/platform/auth';
import { buildNavTree, type NavTree } from '@/platform/nav-engine';
import { Shield, Users, Activity, Database, Lock, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '@/i18n';

async function getTranslations(locale: string = 'ar') {
  const { translations } = await import(`@/i18n/${locale}.json`);
  return translations;
}

export default async function DashboardPage() {
  let session;
  
  try {
    session = await getSession();
  } catch (error) {
    console.error('Session error:', error);
  }

  let navTree: NavTree = { sections: [] };
  let totalPages = 0;
  
  if (session) {
    try {
      navTree = await buildNavTree(session.user.id, session.user.role_code || 'guest');
      totalPages = navTree?.sections?.reduce((acc, s) => acc + s.pages.length, 0) || 0;
    } catch (error) {
      console.error('Nav tree error:', error);
    }
  }

  // Get translations - we'll use default AR for SSR
  const t = await import('@/i18n/ar.json').then(m => m.default || m);

  return (
    <div className="min-h-screen dark:bg-neutral-900 bg-gray-50 p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">{t.dashboard.title}</h1>
            <p className="dark:text-neutral-400 text-gray-600 mt-1">
              {session ? `${t.auth.welcomeBack.replace('{name}', session.user.full_name || session.user.email)}` : t.auth.welcomeGuest}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              {session?.user?.role_name || session?.user?.role_code || t.role.guest}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="dark:text-neutral-400 text-gray-600 text-sm">{t.dashboard.sections}</p>
                <p className="text-2xl font-bold dark:text-white text-gray-900">{navTree.sections.length}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="dark:text-neutral-400 text-gray-600 text-sm">{t.dashboard.pages}</p>
                <p className="text-2xl font-bold dark:text-white text-gray-900">{totalPages}</p>
              </div>
            </div>
          </div>

          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="dark:text-neutral-400 text-gray-600 text-sm">{t.dashboard.role}</p>
                <p className="text-2xl font-bold dark:text-white text-gray-900">{session?.user?.role_code || 'guest'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Database className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="dark:text-neutral-400 text-gray-600 text-sm">{t.dashboard.status}</p>
                <p className="text-2xl font-bold text-emerald-400">{session ? t.dashboard.connected : t.dashboard.guestMode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4">{t.dashboard.schemaDriven}</h2>
            <p className="dark:text-neutral-400 text-gray-600 mb-4">
              {t.dashboard.schemaDescription}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 dark:text-neutral-300 text-gray-700">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>{t.dashboard.navFromDb}</span>
              </div>
              <div className="flex items-center gap-3 dark:text-neutral-300 text-gray-700">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{t.dashboard.rolesFromDb}</span>
              </div>
              <div className="flex items-center gap-3 dark:text-neutral-300 text-gray-700">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>{t.dashboard.permsFromDb}</span>
              </div>
            </div>
          </div>

          <div className="p-6 dark:bg-neutral-800 bg-white dark:border-neutral-700 border border-gray-200 rounded-xl">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4">{t.dashboard.yourNav}</h2>
            {navTree.sections.length > 0 ? (
              <div className="space-y-4">
                {navTree.sections.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">{section.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {section.pages.map((page) => (
                        <span key={page.id} className="px-2 py-1 dark:bg-neutral-700 bg-gray-100 rounded text-sm dark:text-neutral-300 text-gray-700">
                          {page.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-400">{t.dashboard.noNavData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}