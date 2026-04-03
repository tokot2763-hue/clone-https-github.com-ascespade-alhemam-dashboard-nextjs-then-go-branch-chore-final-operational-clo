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
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from sessionStorage for guest users
    const savedTheme = sessionStorage.getItem('theme') as Theme;
    const savedLocale = sessionStorage.getItem('locale') as Locale;
    
    if (savedTheme) setThemeState(savedTheme);
    if (savedLocale) setLocaleState(savedLocale);
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme to document
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

// Translations
export const translations = {
  ar: {
    // General
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    search: 'بحث',
    noData: 'لا توجد بيانات',
    
    // Auth
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    admin: 'الإدارة',
    clinical: 'السريري',
    operations: 'العمليات',
    insurance: 'التأمين',
    guardian: 'ولي الأمر',
    patient: 'المريض',
    
    // Settings
    settings: 'الإعدادات',
    theme: 'المظهر',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    arabic: 'العربية',
    english: 'English',
  },
  en: {
    // General
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    noData: 'No data',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    
    // Navigation
    dashboard: 'Dashboard',
    admin: 'Administration',
    clinical: 'Clinical',
    operations: 'Operations',
    insurance: 'Insurance',
    guardian: 'Guardian',
    patient: 'Patient',
    
    // Settings
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    arabic: 'العربية',
    english: 'English',
  },
};

export function useTranslation() {
  const { locale } = useTheme();
  return translations[locale];
}