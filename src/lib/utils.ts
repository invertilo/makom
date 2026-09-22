import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDays(iso: string, locale: string): string {
  const days = Math.floor(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (days === 0) return rtf.format(0, "day");
  if (days < 30) return rtf.format(-days, "day");
  return rtf.format(-Math.floor(days / 30), "month");
}
