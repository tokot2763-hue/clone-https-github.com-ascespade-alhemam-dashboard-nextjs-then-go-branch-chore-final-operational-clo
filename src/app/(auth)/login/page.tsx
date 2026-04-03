'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, Loader2, Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/ui/providers/ThemeProvider';

const DEMO_ACCOUNTS = [
  { email: 'admin@alhemam.sa', password: 'admin123456', roleKey: 'admin' },
  { email: 'doctor@alhemam.sa', password: 'admin123456', roleKey: 'doctor' },
  { email: 'nurse@alhemam.sa', password: 'admin123456', roleKey: 'nurse' },
  { email: 'patient@alhemam.sa', password: 'admin123456', roleKey: 'patient' },
  { email: 'pharmacist@alhemam.sa', password: 'admin123456', roleKey: 'pharmacist' },
  { email: 'accountant@alhemam.sa', password: 'admin123456', roleKey: 'accountant' },
];

export default function LoginPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { theme, setTheme, resolvedTheme, locale: appLocale, setLocale } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleThemeList: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
  const currentIndex = toggleThemeList.indexOf(theme);
  const nextTheme = toggleThemeList[(currentIndex + 1) % 3];
  const toggleTheme = () => setTheme(nextTheme);
  const toggleLocale = () => setLocale(appLocale === 'ar' ? 'en' : 'ar');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('auth.loginFailed'));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('auth.loginFailed'));
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-800 from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Theme/Locale Toggle */}
      <div className="fixed top-4 right-4 flex gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg dark:bg-neutral-700 bg-gray-200 dark:hover:bg-neutral-600 hover:bg-gray-300" title={t('settings.theme')}>
          {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button onClick={toggleLocale} className="p-2 rounded-lg dark:bg-neutral-700 bg-gray-200 dark:hover:bg-neutral-600 hover:bg-gray-300 font-bold" title={t('settings.language')}>
          {appLocale === 'ar' ? 'ع' : 'EN'}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900">{t('app.name')}</h1>
          <p className="text-neutral-400 mt-2 dark:text-neutral-400 text-gray-600">{t('app.tagline')}</p>
        </div>

        <div className="bg-neutral-800 dark:bg-neutral-800 bg-white rounded-xl border border-neutral-700 dark:border-neutral-700 border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-neutral-300 text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-700 dark:bg-neutral-700 bg-gray-100 border border-neutral-600 dark:border-neutral-600 border-gray-300 rounded-lg text-white dark:text-white text-gray-900 focus:outline-none focus:border-emerald-500"
                placeholder={t('auth.enterEmail')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 dark:text-neutral-300 text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-700 dark:bg-neutral-700 bg-gray-100 border border-neutral-600 dark:border-neutral-600 border-gray-300 rounded-lg text-white dark:text-white text-gray-900 focus:outline-none focus:border-emerald-500 pr-10"
                  placeholder={t('auth.enterPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-400 text-gray-500 hover:text-white dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <p className="text-sm text-neutral-400 dark:text-neutral-400 text-gray-600 text-center mb-3">
            {t('auth.demoAccounts')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.slice(0, 4).map((account) => (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account.email, account.password)}
                disabled={loading}
                className="px-3 py-2 bg-neutral-700 dark:bg-neutral-700 bg-gray-100 border border-neutral-600 dark:border-neutral-600 border-gray-300 rounded-lg text-sm text-neutral-300 dark:text-neutral-300 text-gray-700 hover:bg-neutral-600 dark:hover:bg-neutral-600 hover:border-emerald-500 transition-colors disabled:opacity-50"
              >
                {t(`role.${account.roleKey}`)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {DEMO_ACCOUNTS.slice(4).map((account) => (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account.email, account.password)}
                disabled={loading}
                className="px-3 py-2 bg-neutral-700 dark:bg-neutral-700 bg-gray-100 border border-neutral-600 dark:border-neutral-600 border-gray-300 rounded-lg text-sm text-neutral-300 dark:text-neutral-300 text-gray-700 hover:bg-neutral-600 dark:hover:bg-neutral-600 hover:border-emerald-500 transition-colors disabled:opacity-50"
              >
                {t(`role.${account.roleKey}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}