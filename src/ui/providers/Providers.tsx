'use client';

import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme="system" initialLocale="ar">
      {children}
    </ThemeProvider>
  );
}