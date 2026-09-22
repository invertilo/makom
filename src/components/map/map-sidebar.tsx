"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Place, PlaceType, KashrutStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plate } from "@/components/ui/sign";
import { PLACE_TYPE_GROUPS } from "@/lib/data/store";
import { buildStatusLine, statusTone } from "@/lib/place-helpers";
import { PlaceTypeIcon } from "@/components/map/place-icons";
import { LocateFixed, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SCOPE_KEYS = ["eat", "shop", "kehilla", "tefilla"] as const;

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  activeScopes: string[];
  onToggleScope: (scope: string) => void;
  onClearFilters: () => void;
  places: Place[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onNearMe: () => void;
  className?: string;
  compact?: boolean;
}

export function MapSidebar({
  query,
  onQueryChange,
  activeScopes,
  onToggleScope,
  onClearFilters,
  places,
  selectedId,
  onSelect,
  onNearMe,
  className,
  compact = false,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-surface-2",
        className,
      )}
    >
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className="rounded-md border-border bg-surface-3"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onNearMe}
            aria-label={t("search.nearMe")}
            title={t("search.nearMe")}
          >
            <LocateFixed className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SCOPE_KEYS.map((scope) => {
            const active = activeScopes.includes(scope);
            return (
              <button
                key={scope}
                type="button"
                onClick={() => onToggleScope(scope)}
                className={cn(
                  "inline-flex h-8 items-center rounded-[4px] border px-2.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-transparent bg-seal text-primary-foreground"
                    : "border-[var(--sign-rule)] bg-transparent text-ink-2 hover:border-seal",
                )}
              >
                {t(`search.${scope}`)}
              </button>
            );
          })}
          {(activeScopes.length > 0 || query) && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-8 items-center gap-1 px-2 text-xs text-ink-3"
            >
              <X className="h-3.5 w-3.5" />
              {t("search.clear")}
            </button>
          )}
        </div>
        {!compact && (
          <p className="text-[0.8rem] leading-snug text-ink-3">{t("search.tip")}</p>
        )}
        <p className="label-caps">
          {t("common.results", { count: String(places.length) })}
        </p>
      </div>
      <ul className={cn("flex-1 overflow-y-auto", compact && "max-h-52")}>
        {places.map((place) => {
          const tone = statusTone(place.kashrutStatus);
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onSelect(place.id)}
                className={cn(
                  "sign sign-quiet sign-interactive flex w-full gap-3 rounded-none border-0 border-b border-border px-4 py-3.5 text-start",
                  selectedId === place.id && "bg-surface-3",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 items-center justify-center rounded-[4px]",
                    tone === "seal" && "bg-seal-dim text-seal-ink",
                    tone === "reported" &&
                      "bg-[var(--color-reported-dim)] text-[var(--color-reported-ink)]",
                    tone === "danger" && "bg-destructive/10 text-destructive",
                    (tone === "default" || tone === "muted") &&
                      "bg-surface-3 text-ink-3",
                  )}
                >
                  <PlaceTypeIcon type={place.type} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="block truncate text-[15px] font-semibold tracking-[-0.01em]">
                      {place.name}
                    </span>
                    {tone === "seal" && place.agencyName ? (
                      <Plate className="shrink-0">{place.agencyName}</Plate>
                    ) : tone === "reported" ? (
                      <Plate reported className="shrink-0">
                        {t("place.status.community_report")}
                      </Plate>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-3">
                    {place.city}, {place.country}
                  </span>
                  <span className="mt-1.5 block text-xs font-medium text-seal-ink">
                    {buildStatusLine(place, locale, t)}
                  </span>
                  <span className="mt-1 text-xs text-ink-3">
                    {t(`place.types.${place.type as PlaceType}`)}
                    {" · "}
                    <Badge tone={tone} className="align-middle">
                      {t(`place.status.${place.kashrutStatus as KashrutStatus}`)}
                    </Badge>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function scopesToTypes(scopes: string[]): PlaceType[] {
  if (scopes.length === 0) return [];
  return scopes.flatMap((s) => PLACE_TYPE_GROUPS[s] ?? []);
}
