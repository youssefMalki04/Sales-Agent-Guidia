import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales AI Agent",
  description:
    "Interface frontend pour qualifier, scorer et exporter des leads B2B.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
