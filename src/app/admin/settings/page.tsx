import { Settings, Database, Shield, Globe, Palette, Bell } from 'lucide-react';

export default function AdminSettingsPage() {
  const settingsSections = [
    {
      icon: Database,
      title: 'Database',
      description: 'Configure database connections and schema',
      items: [
        { label: 'Database URL', value: 'xjcxsdoblqckxafvzqsa.supabase.co' },
        { label: 'Tables', value: '7 (nav_sections, nav_pages, iam_users, iam_roles, etc.)' },
        { label: 'RLS Policies', value: 'Active (service key bypass)' },
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Authentication and authorization settings',
      items: [
        { label: 'Auth Provider', value: 'Supabase Auth' },
        { label: 'Session', value: 'Cookie-based (24h)' },
        { label: 'Role System', value: 'DB-driven with email fallback' },
      ],
    },
    {
      icon: Globe,
      title: 'Platform',
      description: 'General platform configuration',
      items: [
        { label: 'Platform', value: 'Alhemam Healthcare' },
        { label: 'Mode', value: 'Production' },
        { label: 'Tenant ID', value: '00000000-0000-0000-0000-000000000001' },
      ],
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme and design settings',
      items: [
        { label: 'Theme', value: 'Dark (neutral-900)' },
        { label: 'Primary', value: 'Emerald' },
        { label: 'Font', value: 'System UI' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-neutral-400">Configure your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-white font-medium">{section.title}</h2>
                </div>
                <p className="text-neutral-400 text-sm mb-3">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-neutral-500">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-2">🔧 Advanced Configuration</h3>
          <p className="text-neutral-400 text-sm">
            Advanced settings are managed directly in the database through Supabase dashboard.<br/>
            Contact your administrator for sensitive configuration changes.
          </p>
        </div>
      </div>
    </div>
  );
}