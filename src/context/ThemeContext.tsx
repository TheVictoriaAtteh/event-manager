import React, { useEffect, useMemo, useState } from "react";
import {
  ThemeContext,
  type ThemePreference,
  type ResolvedTheme,
} from "./theme-context";

const STORAGE_KEY = "event-manager-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem(
      STORAGE_KEY
    ) as ThemePreference | null;

    // Light mode is the default when no preference has been saved
    return savedTheme || "light";
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme()
  );

  // Listen for OS-level light/dark changes.
  // This only matters when the user selects "System".
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");

    const handler = () => {
      setSystemTheme(getSystemTheme());
    };

    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, []);

  // Determine the actual theme being displayed
  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Apply the theme to the <html> element
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      resolvedTheme
    );
  }, [resolvedTheme]);

  // Save the user's selected preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}