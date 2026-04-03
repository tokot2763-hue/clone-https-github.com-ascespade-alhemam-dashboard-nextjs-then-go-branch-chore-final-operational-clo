'use client';

import Link from "next/link";
import { Shield, Database, Activity, Users } from "lucide-react";
import { useTheme } from "@/ui/providers/ThemeProvider";
import { useTranslation } from "@/i18n";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  
  const isDark = resolvedTheme === 'dark';

  return (
    <main className={`min-h-screen ${isDark ? 'bg-gradient-to-b from-neutral-900 to-neutral-800' : 'bg-gradient-to-b from-gray-100 to-gray-200'}`}>
      <nav className={`flex items-center justify-between px-8 py-4 ${isDark ? 'border-neutral-700' : 'border-gray-300'}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-emerald-400" />
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('app.name')}</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className={`px-4 py-2 ${isDark ? 'text-neutral-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            {t('auth.login')}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {t('auth.signIn')}
          </Link>
        </div>
      </nav>

      <section className="px-8 py-24 text-center">
        <h1 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
          {t('app.tagline')}
        </h1>
        <p className={`text-xl ${isDark ? 'text-neutral-400' : 'text-gray-600'} max-w-2xl mx-auto mb-12`}>
          {t('dashboard.schemaDescription')}
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            {t('auth.signIn')}
          </Link>
        </div>
      </section>

      <section className={`px-8 py-16 ${isDark ? 'bg-neutral-800/50' : 'bg-gray-200'}`}>
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center mb-12`}>Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className={`p-6 ${isDark ? 'bg-neutral-800' : 'bg-white'} ${isDark ? 'border-neutral-700' : 'border-gray-300'} rounded-xl border`}>
            <Database className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Schema-Driven</h3>
            <p className={isDark ? 'text-neutral-400' : 'text-gray-600'}>
              All pages, sections, and navigation are read from the database.
            </p>
          </div>
          <div className={`p-6 ${isDark ? 'bg-neutral-800' : 'bg-white'} ${isDark ? 'border-neutral-700' : 'border-gray-300'} rounded-xl border`}>
            <Shield className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Role-Based Access</h3>
            <p className={isDark ? 'text-neutral-400' : 'text-gray-600'}>
              11 predefined roles with granular permissions.
            </p>
          </div>
          <div className={`p-6 ${isDark ? 'bg-neutral-800' : 'bg-white'} ${isDark ? 'border-neutral-700' : 'border-gray-300'} rounded-xl border`}>
            <Activity className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Multi-Tenant</h3>
            <p className={isDark ? 'text-neutral-400' : 'text-gray-600'}>
              Built for healthcare organizations.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center mb-12`}>Available Roles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {['admin', 'doctor', 'nurse', 'patient'].map((role) => (
            <div key={role} className={`p-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} ${isDark ? 'border-neutral-700' : 'border-gray-300'} rounded-lg border`}>
              <Shield className="w-8 h-8 text-emerald-400 mb-2" />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t(`role.${role}`)}</h3>
            </div>
          ))}
        </div>
      </section>

      <footer className={`px-8 py-8 ${isDark ? 'border-neutral-700' : 'border-gray-300'} border-t text-center`}>
        <p className={isDark ? 'text-neutral-500' : 'text-gray-500'}>
          Powered by Next.js 16 + Supabase
        </p>
      </footer>
    </main>
  );
}