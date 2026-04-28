"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  initialTheme = "theme-sky" 
}: { 
  children: ReactNode; 
  initialTheme?: string; 
}) {
  const [theme, setThemeState] = useState<string>(initialTheme);

  // Quando o tema mudar, atualizamos o HTML localmente para efeito imediato
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    // Garante que o tema inicial seja injetado no client-side
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}