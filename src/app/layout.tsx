import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Safe Mode | Live Disruption Tracker",
  description: "Track live public disruptions on a real-time city map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
