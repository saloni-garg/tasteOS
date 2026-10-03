import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindWise — Find what matters",
  description: "AI-generated decision criteria, real research, and transparent rankings around your priorities.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
