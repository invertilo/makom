import { defineRouting } from "next-intl/routing";

export const locales = [
  "en",
  "he",
  "es",
  "pt",
  "fr",
  "de",
  "ru",
  // Phase 2
  "yi",
  "ar",
  "it",
  "nl",
  "hu",
  "fa",
  "tr",
  "uk",
  "pl",
  "am",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["he", "yi", "ar", "fa"];

export const phase1Locales: Locale[] = [
  "en",
  "he",
  "es",
  "pt",
  "fr",
  "de",
  "ru",
];

export const localeNames: Record<Locale, string> = {
  en: "English",
  he: "עברית",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  yi: "ייִדיש",
  ar: "العربية",
  it: "Italiano",
  nl: "Nederlands",
  hu: "Magyar",
  fa: "فارسی",
  tr: "Türkçe",
  uk: "Українська",
  pl: "Polski",
  am: "አማርኛ",
};

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}
