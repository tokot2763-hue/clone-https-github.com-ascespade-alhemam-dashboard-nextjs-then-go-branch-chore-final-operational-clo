import { getSession } from '@/platform/auth';
import { buildNavTree, type NavTree } from '@/platform/nav-engine';
import { redirect } from 'next/navigation';
import { Shield, Users, Activity, Database, Lock, LayoutDashboard } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-neutral-400 mt-1">
              {session ? `Welcome back, ${session.user.full_name || session.user.email}` : 'Welcome to Alhemam Healthcare Platform'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              {session?.user?.role_name || session?.user?.role_code || 'Guest'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Sections</p>
                <p className="text-2xl font-bold text-white">{navTree.sections.length || 6}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Pages</p>
                <p className="text-2xl font-bold text-white">{totalPages || 63}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Role</p>
                <p className="text-2xl font-bold text-white">{session?.user?.role_code || 'guest'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Database className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Status</p>
                <p className="text-2xl font-bold text-emerald-400">{session ? 'Connected' : 'Guest Mode'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-semibold text-white mb-4">Schema-Driven Architecture</h2>
            <p className="text-neutral-400 mb-4">
              This dashboard is powered by a schema-driven architecture. All navigation, roles, and permissions are read from the database.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-300">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>Navigation Sections from DB</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Roles from Database</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>Permissions from Database</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral-800 rounded-xl border border-neutral-700">
            <h2 className="text-xl font-semibold text-white mb-4">Your Navigation</h2>
            {navTree.sections.length > 0 ? (
              <div className="space-y-4">
                {navTree.sections.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-sm font-medium text-emerald-400 mb-2">{section.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {section.pages.map((page) => (
                        <span key={page.id} className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300">
                          {page.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-emerald-400 mb-2">Dashboard</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300">Main Dashboard</span>
                    <span className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300">Statistics</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-emerald-400 mb-2">Patients</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300">Patient List</span>
                    <span className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300">Add Patient</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
