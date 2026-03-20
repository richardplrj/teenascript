import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import NavLinks from "./components/NavLinks";
import { ToastProvider } from "./components/ToastProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title:       "TeenaScript — Digital Library",
  description: "A curated digital library with built-in plagiarism detection powered by TF-IDF cosine similarity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-cream dark:bg-dark-bg text-charcoal dark:text-stone-100 font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <ToastProvider>

            {/* ── Navigation ─────────────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-stone-200 dark:border-dark-border">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-0 sm:h-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                <a
                  href="/"
                  className="font-serif text-xl font-bold text-charcoal dark:text-stone-100 tracking-tight hover:text-terracotta dark:hover:text-terracotta transition-colors"
                >
                  TeenaScript
                </a>
                <NavLinks />
              </div>
            </header>

            {/* ── Page content ────────────────────────────────────── */}
            <main className="flex-1">{children}</main>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="border-t border-stone-200 dark:border-dark-border py-5 px-4 sm:px-6">
              <div className="max-w-5xl mx-auto text-center">
                <p className="font-sans text-xs text-stone-400 dark:text-stone-500">
                  © {new Date().getFullYear()} TeenaScript. All rights reserved.
                </p>
              </div>
            </footer>

          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
