import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/ui/providers/Providers";

export const metadata: Metadata = {
  title: "Alhemam Healthcare Platform",
  description: "Schema-Driven Healthcare Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
