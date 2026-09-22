"use client";

import { Marker } from "@vis.gl/react-maplibre";
import type { Community } from "@/types";

export function CommunityMarkers({
  communities,
  onSelect,
}: {
  communities: Community[];
  onSelect?: (id: string) => void;
}) {
  return (
    <>
      {communities.map((c) => (
        <Marker
          key={c.id}
          longitude={c.lng}
          latitude={c.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSelect?.(c.id);
          }}
        >
          <button
            type="button"
            aria-label={c.name}
            className="flex h-9 min-w-9 items-center justify-center rounded-full border border-seal/30 bg-card px-2.5 text-xs font-semibold tracking-wide text-seal shadow-[0_4px_14px_rgba(26,31,28,0.12)]"
            title={
              c.population
                ? `${c.name} · ~${c.population.toLocaleString()}`
                : c.name
            }
          >
            קה
          </button>
        </Marker>
      ))}
    </>
  );
}
