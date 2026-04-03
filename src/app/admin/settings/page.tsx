'use client';

import { useState } from 'react';
import { Settings, Database, Shield, Globe, Palette, Bell, Moon, Sun, Loader2, Check } from 'lucide-react';
import { getSession } from '@/platform/auth';

interface SettingsSection {
  icon: any;
  title: string;
  description: string;
  items: { label: string; value: string }[];
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      // Get session to get user ID
      const session = await getSession();
      
      if (session) {
        await fetch('/api/v1/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            theme,
            locale,
          }),
        });
      }
      
      // Also save to sessionStorage as fallback
      sessionStorage.setItem('theme', theme);
      sessionStorage.setItem('locale', locale);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const settingsSections: SettingsSection[] = [
    {
      icon: Database,
      title: 'Database',
      description: 'Configure database connections and schema',
      items: [
        { label: 'Database URL', value: 'xjcxsdoblqckxafvzqsa.supabase.co' },
        { label: 'Tables', value: '8+ tables (user_preferences added)' },
        { label: 'RLS Policies', value: 'Active' },
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
        { label: 'Default Locale', value: 'Arabic (ar)' },
      ],
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Theme and design settings',
      items: [
        { label: 'Default Theme', value: 'Dark' },
        { label: 'Primary Color', value: 'Emerald' },
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

        {/* Theme & Locale Settings */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            Theme & Language
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Theme / المظهر
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    Dark / داكن
                  </p>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-emerald-400' : 'text-neutral-400'}`} />
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    Light / فاتح
                  </p>
                </button>
              </div>
            </div>

            {/* Locale Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">
                Language / اللغة
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setLocale('ar')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    locale === 'ar' 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <p className={`text-xl font-bold mb-1 ${locale === 'ar' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    العربية
                  </p>
                  <p className={`text-sm ${locale === 'ar' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    Arabic
                  </p>
                </button>
                <button
                  onClick={() => setLocale('en')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    locale === 'en' 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-neutral-600 hover:border-neutral-500'
                  }`}
                >
                  <p className={`text-xl font-bold mb-1 ${locale === 'en' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    English
                  </p>
                  <p className={`text-sm ${locale === 'en' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                    الإنجليزية
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-lg transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
            <span className="text-neutral-500 text-sm">
              Changes apply immediately
            </span>
          </div>
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
          <h3 className="text-lg font-semibold text-white mb-2">🔧 Database Schema</h3>
          <p className="text-neutral-400 text-sm mb-3">
            Run the migration to create user_preferences table:
          </p>
          <pre className="bg-neutral-900 p-3 rounded-lg text-xs text-neutral-300 overflow-x-auto">
{`-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark',
  locale TEXT NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);`}
          </pre>
        </div>
      </div>
    </div>
  );
}