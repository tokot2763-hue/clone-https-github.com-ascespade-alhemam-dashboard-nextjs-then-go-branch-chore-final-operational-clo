import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
