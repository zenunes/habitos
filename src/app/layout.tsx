import type { Metadata, Viewport } from "next";
import { Rajdhani, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { getCurrentUser } from "@/modules/auth/server/session";
import { getUserProgress } from "@/modules/progression/server/queries";
import { getThemeByLevel } from "@/modules/progression/domain/progression";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solo Leveling - System",
  description: "Arise. Seu sistema pessoal de evolução.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let theme = "theme-sky";
  
  try {
    const user = await getCurrentUser();
    if (user) {
      const progress = await getUserProgress();
      theme = getThemeByLevel(progress.level);
    }
  } catch {
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning data-theme={theme}>
      <body
        className={`${rajdhani.variable} ${outfit.variable} font-body antialiased bg-[#030712] text-zinc-100 min-h-screen pb-20 md:pb-0`}
      >
        <ThemeProvider initialTheme={theme}>
          {children}
          <MobileBottomNav />
          <Toaster 
            theme="dark" 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#0f172a',
                border: '1px solid var(--theme-base)',
                color: '#f8fafc',
                fontFamily: 'var(--font-rajdhani)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                boxShadow: '0 0 15px var(--theme-glow)'
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
