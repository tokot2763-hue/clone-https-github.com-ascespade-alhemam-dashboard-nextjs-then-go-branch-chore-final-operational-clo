import { getSession } from '@/platform/auth';
import { buildNavTree } from '@/platform/nav-engine';
import { Shield, Users, Activity, Database, Lock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  let navTree;
  try {
    navTree = await buildNavTree(session.user.id, session.user.role_code || 'guest');
  } catch (e) {
    navTree = { sections: [] };
  }

  const totalPages = navTree.sections.reduce((acc, s) => acc + s.pages.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400 mt-1">
            Welcome back, {session.user.full_name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 font-medium">{session.user.role_name}</span>
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
              <p className="text-2xl font-bold text-white">{navTree.sections.length}</p>
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
              <p className="text-2xl font-bold text-white">{totalPages}</p>
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
              <p className="text-2xl font-bold text-white">{session.user.role_code}</p>
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
              <p className="text-2xl font-bold text-emerald-400">Active</p>
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
              <span>6 Navigation Sections</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>11 Roles (Admin, Doctor, Nurse, etc.)</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>14 Permission Scopes</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>63 Dynamic Pages</span>
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
                      <span
                        key={page.id}
                        className="px-2 py-1 bg-neutral-700 rounded text-sm text-neutral-300"
                      >
                        {page.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400">Loading navigation from database...</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LayoutDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
