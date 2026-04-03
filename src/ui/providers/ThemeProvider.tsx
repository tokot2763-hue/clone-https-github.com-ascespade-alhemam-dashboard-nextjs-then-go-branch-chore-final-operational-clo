'use client';

import { createContext, useContext, useEffect, useState, useSyncExternalStore, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
type Locale = 'ar' | 'en';

const STORAGE_KEYS = {
  theme: 'alhemam_theme',
  locale: 'alhemam_locale',
} as const;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  locale: 'ar',
  setTheme: () => {},
  setLocale: () => {},
  isLoading: true,
});

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEYS.theme) as Theme) || 'system';
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'ar';
  return (localStorage.getItem(STORAGE_KEYS.locale) as Locale) || 'ar';
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  initialLocale?: Locale;
}

export function ThemeProvider({ 
  children, 
  initialTheme = 'system', 
  initialLocale = 'ar' 
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const stored = getStoredTheme();
    return resolveTheme(stored);
  });

  // Sync with system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  // Initialize on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const storedLocale = getStoredLocale();
    setThemeState(storedTheme);
    setLocaleState(storedLocale);
    setResolvedTheme(resolveTheme(storedTheme));
    setIsLoading(false);
  }, []);

  // Apply theme and locale to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
    document.documentElement.dataset.theme = theme;
  }, [resolvedTheme, theme]);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.theme, newTheme);
    setResolvedTheme(resolveTheme(newTheme));
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEYS.locale, newLocale);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme,
      locale, 
      setTheme, 
      setLocale, 
      isLoading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}