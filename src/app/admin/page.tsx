import { getSession, canAccessPage } from '@/platform/auth';
import Link from 'next/link';
import { Users, Shield, Navigation, Settings, LayoutDashboard, FileText, Plus, ChevronRight, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-white">Please <Link href="/login" className="text-emerald-400 hover:underline">login</Link> to access admin</p>
      </div>
    );
  }
  
  const isAdmin = session.user.role_level >= 100;
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-neutral-400">You need admin privileges to access this page.</p>
          <p className="text-neutral-500 mt-2">Your role: {session.user.role_name} (Level {session.user.role_level})</p>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: 'Users Management',
      description: 'Manage users, roles, and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure roles and access levels',
      href: '/admin/roles',
      icon: Shield,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Navigation',
      description: 'Manage navigation sections and pages',
      href: '/admin/navigation',
      icon: Navigation,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Settings',
      description: 'Platform settings and configuration',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-1">Manage your platform</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">{session.user.role_name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className={`${module.bg} border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors group`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className={`flex items-center gap-2 mb-2`}>
                      <Icon className={`w-5 h-5 ${module.color}`} />
                      <h2 className="text-lg font-semibold text-white">{module.title}</h2>
                    </div>
                    <p className="text-neutral-400 text-sm">{module.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">Platform Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-300">Current User</span>
                <span className="text-white">{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Role Level</span>
                <span className="text-emerald-400">{session.user.role_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-300">Organization</span>
                <span className="text-white">{session.user.organization_id || 'Default'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}