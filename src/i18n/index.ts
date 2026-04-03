'use client';

import { useTheme } from '@/ui/providers/ThemeProvider';
import arTranslations from './ar.json';
import enTranslations from './en.json';

type TranslationKeys = typeof arTranslations;

const translations: Record<string, TranslationKeys> = {
  ar: arTranslations,
  en: enTranslations,
};

export function useTranslation() {
  const { locale } = useTheme();
  
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation not found: ${key}`);
      return key;
    }
    
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, param) => params[param] || `{${param}}`);
    }
    
    return value;
  };
  
  return { t, locale };
}

export { translations, arTranslations, enTranslations };
export type { TranslationKeys };