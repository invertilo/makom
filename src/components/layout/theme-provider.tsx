"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Atlas stays in daylight — map tiles and status colors need a stable light surface. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
