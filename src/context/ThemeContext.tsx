import React, { useEffect, useMemo, useState } from "react";
import {
  ThemeContext,
  type ThemePreference,
    type ResolvedTheme,}
 from "./theme-context";
const STORAGE_KEY = "event-manager-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(STORAGE_KEY) as ThemePreference) || "dark";
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    getSystemTheme()
  );

  // Listen for OS-level light/dark changes, only relevant when theme is "system"
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => setSystemTheme(getSystemTheme());
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Derived value, computed on every render instead of stored via its own effect
  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // Side effects on external systems (DOM attribute, localStorage) — legitimate effect use
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (next: ThemePreference) => setThemeState(next);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}