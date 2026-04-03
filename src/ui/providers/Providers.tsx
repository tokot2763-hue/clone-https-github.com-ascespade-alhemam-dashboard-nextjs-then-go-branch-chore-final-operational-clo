'use client';

import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialTheme="dark" initialLocale="ar">
      {children}
    </ThemeProvider>
  );
}