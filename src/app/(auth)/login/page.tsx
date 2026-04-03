'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/ui/providers/ThemeProvider';

const DEMO_ACCOUNTS = [
  { email: 'admin@alhemam.sa', password: 'admin123456', role: 'Admin' },
  { email: 'doctor@alhemam.sa', password: 'admin123456', role: 'Doctor' },
  { email: 'nurse@alhemam.sa', password: 'admin123456', role: 'Nurse' },
  { email: 'patient@alhemam.sa', password: 'admin123456', role: 'Patient' },
  { email: 'pharmacist@alhemam.sa', password: 'admin123456', role: 'Pharmacist' },
  { email: 'accountant@alhemam.sa', password: 'admin123456', role: 'Accountant' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    console.log('Quick login clicked for:', email);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Get token from response and pass via URL
      const token = data.session?.access_token;
      console.log('Login successful, redirecting with token...');
      window.location.href = token ? `/dashboard?token=${token.substring(0, 50)}` : '/dashboard';
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Alhemam</h1>
          <p className="text-neutral-400 mt-2">Healthcare Platform Login</p>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <p className="text-sm text-neutral-400 text-center mb-3">
            Quick Login (Demo Accounts)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.slice(0, 4).map((account) => (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account.email, account.password)}
                disabled={loading}
                className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-neutral-300 hover:bg-neutral-600 hover:border-emerald-500 transition-colors disabled:opacity-50"
              >
                {account.role}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {DEMO_ACCOUNTS.slice(4).map((account) => (
              <button
                key={account.email}
                onClick={() => handleQuickLogin(account.email, account.password)}
                disabled={loading}
                className="px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-sm text-neutral-300 hover:bg-neutral-600 hover:border-emerald-500 transition-colors disabled:opacity-50"
              >
                {account.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
