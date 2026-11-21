"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type StudioTheme = "dark" | "light";

interface ThemeContextValue {
  theme: StudioTheme;
  toggleTheme: () => void;
  setTheme: (theme: StudioTheme) => void;
}

const STORAGE_KEY = "gm-studio-theme-v2";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<StudioTheme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    try {
      window.localStorage.setItem(STORAGE_KEY, "dark");
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setTheme = () => {
    setThemeState("dark");
    document.documentElement.dataset.theme = "dark";
  };

  const toggleTheme = () => {
    setTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useStudioTheme() {
  return useContext(ThemeContext);
}
