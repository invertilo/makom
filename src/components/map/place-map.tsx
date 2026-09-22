"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MapGL, {
  Marker,
  NavigationControl,
  type MapRef,
} from "@vis.gl/react-maplibre";
import type { Community, Place } from "@/types";
import { statusTone } from "@/lib/place-helpers";
import { CommunityMarkers } from "@/components/community/community-markers";
import { MapPinMarker } from "@/components/map/place-icons";
import { cn } from "@/lib/utils";

/** Soft muted basemap — Carto Positron via OpenFreeMap fallback chain */
const STYLE_PRIMARY =
  process.env.NEXT_PUBLIC_MAP_STYLE ??
  "https://tiles.openfreemap.org/styles/positron";
const STYLE_FALLBACK =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface Props {
  places: Place[];
  communities?: Community[];
  showCommunities?: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onSelectCommunity?: (id: string) => void;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
  className?: string;
}

type Cluster = {
  id: string;
  lat: number;
  lng: number;
  places: Place[];
};

function clusterPlaces(places: Place[], zoom: number): Cluster[] {
  const cell =
    zoom < 4 ? 8 : zoom < 7 ? 3 : zoom < 10 ? 1 : zoom < 13 ? 0.25 : 0;
  if (cell === 0) {
    return places.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      places: [p],
    }));
  }
  const buckets = new globalThis.Map<string, Place[]>();
  for (const p of places) {
    const key = `${Math.round(p.lat / cell)}_${Math.round(p.lng / cell)}`;
    const list = buckets.get(key) ?? [];
    list.push(p);
    buckets.set(key, list);
  }
  return [...buckets.entries()].map(([key, list]) => ({
    id: `c-${key}`,
    lat: list.reduce((sum: number, p: Place) => sum + p.lat, 0) / list.length,
    lng: list.reduce((sum: number, p: Place) => sum + p.lng, 0) / list.length,
    places: list,
  }));
}

export function PlaceMap({
  places,
  communities = [],
  showCommunities = false,
  selectedId,
  onSelect,
  onSelectCommunity,
  flyTo,
  className,
}: Props) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(2.4);
  const [styleUrl, setStyleUrl] = useState(STYLE_PRIMARY);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const clusters = useMemo(() => clusterPlaces(places, zoom), [places, zoom]);

  const resize = useCallback(() => {
    try {
      const ref = mapRef.current as unknown as {
        getMap?: () => { resize: () => void };
        resize?: () => void;
      } | null;
      ref?.getMap?.()?.resize();
      ref?.resize?.();
    } catch {
      /* map not ready */
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => resize());
    ro.observe(el);
    const t = window.setTimeout(resize, 80);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [resize]);

  useEffect(() => {
    if (!flyTo || !ready) return;
    mapRef.current?.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 12,
      essential: true,
      duration: 900,
    });
  }, [flyTo, ready]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-[280px] w-full overflow-hidden bg-[rgb(242,243,240)]",
        className,
      )}
    >
      {!ready && !failed && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[rgb(242,243,240)] text-sm text-[var(--muted-foreground)]">
          Loading map…
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[rgb(242,243,240)] px-6 text-center text-sm text-[var(--muted-foreground)]">
          Map tiles could not load. Check your network and refresh.
        </div>
      )}
      <MapGL
        ref={mapRef}
        initialViewState={{ longitude: 12, latitude: 28, zoom: 2.4 }}
        mapStyle={styleUrl}
        style={{ width: "100%", height: "100%" }}
        onLoad={() => {
          setReady(true);
          setFailed(false);
          resize();
        }}
        onError={() => {
          if (styleUrl !== STYLE_FALLBACK) {
            setStyleUrl(STYLE_FALLBACK);
            setReady(false);
          } else {
            setFailed(true);
          }
        }}
        onMoveEnd={(e) => setZoom(e.viewState.zoom)}
        attributionControl={{ compact: true }}
        reuseMaps
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {showCommunities && (
          <CommunityMarkers
            communities={communities}
            onSelect={onSelectCommunity}
          />
        )}
        {clusters.map((cluster) => {
          if (cluster.places.length === 1) {
            const place = cluster.places[0]!;
            return (
              <Marker
                key={place.id}
                longitude={place.lng}
                latitude={place.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  onSelect(place.id);
                }}
              >
                <MapPinMarker
                  type={place.type}
                  tone={statusTone(place.kashrutStatus)}
                  selected={place.id === selectedId}
                  label={place.name}
                />
              </Marker>
            );
          }

          return (
            <Marker
              key={cluster.id}
              longitude={cluster.lng}
              latitude={cluster.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                mapRef.current?.flyTo({
                  center: [cluster.lng, cluster.lat],
                  zoom: Math.min(zoom + 2.2, 14),
                  essential: true,
                });
              }}
            >
              <button
                type="button"
                className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[var(--seal)] px-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(14,107,98,0.35)]"
                aria-label={`${cluster.places.length} places`}
              >
                {cluster.places.length}
              </button>
            </Marker>
          );
        })}
      </MapGL>
    </div>
  );
}
