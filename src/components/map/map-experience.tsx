"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getPlace, getPlaces, getCommunities } from "@/lib/data/store";
import { MapSidebar, scopesToTypes } from "@/components/map/map-sidebar";
import { PlacePanel } from "@/components/place/place-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SuggestEditForm } from "@/components/place/suggest-edit-form";
import { useAuth } from "@/components/auth/auth-provider";
import { haversineKm } from "@/lib/place-helpers";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

const PlaceMap = dynamic(
  () => import("@/components/map/place-map").then((m) => m.PlaceMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[rgb(242,243,240)] text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  },
);

export function MapExperience({
  initialPlaceId,
  initialCity,
}: {
  initialPlaceId?: string;
  initialCity?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState(initialCity ?? "");
  const [scopes, setScopes] = useState<string[]>([]);
  const [showCommunities, setShowCommunities] = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPlaceId ?? null,
  );
  const [sheetOpen, setSheetOpen] = useState(!!initialPlaceId);
  const [editOpen, setEditOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(
    initialPlaceId && getPlace(initialPlaceId)
      ? {
          lat: getPlace(initialPlaceId)!.lat,
          lng: getPlace(initialPlaceId)!.lng,
          zoom: 13,
        }
      : null,
  );
  const [near, setNear] = useState<{ lat: number; lng: number } | null>(null);

  const places = useMemo(() => {
    const types = scopesToTypes(scopes);
    let list = getPlaces({
      query,
      types,
      denomination: user?.denomination,
      orthodoxStream: user?.orthodoxStream,
    });
    if (near) {
      list = [...list].sort(
        (a, b) => haversineKm(near, a) - haversineKm(near, b),
      );
    }
    return list;
  }, [query, scopes, user, near]);

  const selected = selectedId ? getPlace(selectedId) : undefined;

  function selectPlace(id: string) {
    setSelectedId(id);
    setSheetOpen(true);
    setMobileListOpen(false);
    const p = getPlace(id);
    if (p) setFlyTo({ lat: p.lat, lng: p.lng, zoom: 13 });
  }

  function onNearMe() {
    if (!navigator.geolocation) {
      toast.error(t("search.locationDenied"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setNear(coords);
        setFlyTo({ ...coords, zoom: 11 });
      },
      () => toast.error(t("search.locationDenied")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const toggleScope = (scope: string) =>
    setScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );

  const clearFilters = () => {
    setQuery("");
    setScopes([]);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem-4rem)] md:h-[calc(100dvh-4rem)]">
      <MapSidebar
        className="hidden w-[400px] shrink-0 border-e border-border md:flex"
        query={query}
        onQueryChange={setQuery}
        activeScopes={scopes}
        onToggleScope={toggleScope}
        onClearFilters={clearFilters}
        places={places}
        selectedId={selectedId}
        onSelect={selectPlace}
        onNearMe={onNearMe}
      />
      <div className="relative min-w-0 flex-1">
        <div className="absolute inset-x-3 top-3 z-10 flex gap-2 md:hidden">
          <div className="sign sign-quiet min-w-0 flex-1 overflow-hidden bg-surface-2/95 shadow-[var(--shadow-lg)] backdrop-blur-md">
            <MapSidebar
              compact
              className={mobileListOpen ? "max-h-[50vh]" : "max-h-none"}
              query={query}
              onQueryChange={(q) => {
                setQuery(q);
                setMobileListOpen(true);
              }}
              activeScopes={scopes}
              onToggleScope={toggleScope}
              onClearFilters={clearFilters}
              places={mobileListOpen ? places.slice(0, 10) : []}
              selectedId={selectedId}
              onSelect={selectPlace}
              onNearMe={onNearMe}
            />
          </div>
        </div>
        <div className="absolute bottom-5 start-4 z-10 flex gap-2 md:bottom-6">
          <Button
            size="sm"
            variant={showCommunities ? "default" : "outline"}
            onClick={() => setShowCommunities((v) => !v)}
            className="shadow-[var(--shadow-sm)]"
          >
            {t("nav.communities")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="shadow-[var(--shadow-sm)] md:hidden"
            onClick={() => setMobileListOpen((v) => !v)}
          >
            {t("common.results", { count: String(places.length) })}
          </Button>
        </div>
        <PlaceMap
          places={places}
          communities={getCommunities()}
          showCommunities={showCommunities}
          selectedId={selectedId}
          onSelect={selectPlace}
          onSelectCommunity={() => router.push("/communities")}
          flyTo={flyTo}
        />
      </div>

      <Sheet
        open={sheetOpen && !!selected}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setSelectedId(null);
        }}
      >
        {selected && (
          <SheetContent title={selected.name}>
            <PlacePanel
              place={selected}
              onSuggestEdit={() => setEditOpen(true)}
            />
          </SheetContent>
        )}
      </Sheet>

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        {selected && (
          <SheetContent title={t("suggest.editTitle")}>
            <SuggestEditForm
              place={selected}
              onDone={() => setEditOpen(false)}
            />
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
