import type { Metadata } from "next";
import { Rajdhani, Outfit } from "next/font/google";
import { Toaster } from "sonner";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${rajdhani.variable} ${outfit.variable} font-body antialiased bg-[#030712] text-zinc-100 min-h-screen`}
      >
        <Toaster 
          theme="dark" 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid #0ea5e9',
              color: '#f8fafc',
              fontFamily: 'var(--font-rajdhani)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold',
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
