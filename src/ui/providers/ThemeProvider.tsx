'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Locale = 'ar' | 'en';

interface ThemeContextType {
  theme: Theme;
  locale: Locale;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  locale: 'ar',
  setTheme: () => {},
  setLocale: () => {},
  isLoading: true,
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  initialLocale?: Locale;
}

export function ThemeProvider({ children, initialTheme = 'dark', initialLocale = 'ar' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return initialTheme;
    return (sessionStorage.getItem('theme') as Theme) || initialTheme;
  });
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return initialLocale;
    return (sessionStorage.getItem('locale') as Locale) || initialLocale;
  });
  const isLoading = false;

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [theme, locale]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    sessionStorage.setItem('theme', newTheme);
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    sessionStorage.setItem('locale', newLocale);
  };

  return (
    <ThemeContext.Provider value={{ theme, locale, setTheme, setLocale, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}