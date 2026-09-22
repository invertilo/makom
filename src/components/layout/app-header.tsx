"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeNames, phase1Locales, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/map" as const, key: "map" },
  { href: "/communities" as const, key: "communities" },
  { href: "/suggest" as const, key: "suggest" },
  { href: "/moderation" as const, key: "moderation" },
];

export function AppHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { user, shabbatLocked } = useAuth();

  return (
    <header className="layer-glass sticky top-0 z-[100] w-full border-b border-border">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            className="shrink-0 font-display text-lg font-extrabold tracking-[-0.03em] text-seal-ink"
            aria-label={`${t("brand.name")}, home`}
          >
            {t("brand.name")}
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-16 items-center px-3 text-[15px] font-medium transition-colors",
                    active ? "text-foreground" : "text-ink-2 hover:text-foreground",
                  )}
                >
                  {t(`nav.${item.key}`)}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-[2px] bg-seal transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {shabbatLocked && (
            <span className="hidden rounded-[4px] bg-[var(--color-reported-dim)] px-2.5 py-1 text-xs font-semibold text-[var(--color-reported-ink)] sm:inline">
              {t("account.shabbatActive")}
            </span>
          )}
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-ink-2 md:hidden">
            <Link href="/map" aria-label={t("nav.map")}>
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <label className="sr-only" htmlFor="locale-select">
            {t("account.language")}
          </label>
          <select
            id="locale-select"
            className="hidden h-10 rounded-md border border-border bg-surface-3 px-2 text-sm sm:block"
            value={locale}
            onChange={(e) => {
              const next = e.target.value as Locale;
              const path = pathname || "/";
              window.location.href = `/${next}${path === "/" ? "" : path}`;
            }}
          >
            {[...phase1Locales, "yi", "ar", "it", "nl", "hu", "fa", "tr", "uk", "pl", "am"].map(
              (code) => (
                <option key={code} value={code}>
                  {localeNames[code as Locale]}
                </option>
              ),
            )}
          </select>
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link href="/account">
              <User className="h-4 w-4" aria-hidden />
              {user ? user.displayName.split(" ")[0] : t("nav.account")}
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/map">{t("landing.cta")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
