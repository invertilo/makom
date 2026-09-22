"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { MapPinned, Users, Plus, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/map" as const, key: "map", icon: MapPinned },
  { href: "/communities" as const, key: "communities", icon: Users },
  { href: "/suggest" as const, key: "suggest", icon: Plus, plate: true },
  { href: "/moderation" as const, key: "moderation", icon: Shield },
  { href: "/account" as const, key: "account", icon: User },
];

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="layer-glass fixed inset-x-0 bottom-0 z-50 border-t border-border pb-safe md:hidden"
    >
      <ul className="flex h-16 items-stretch justify-around">
        {TABS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-seal-ink" : "text-ink-2",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-10 items-center justify-center rounded-md transition-colors",
                    item.plate && "bg-seal text-primary-foreground",
                    active && !item.plate && "bg-seal-dim",
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    aria-hidden
                    strokeWidth={item.plate ? 2.5 : 2}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-none",
                    active ? "font-semibold" : "font-medium",
                  )}
                >
                  {t(`nav.${item.key}`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
