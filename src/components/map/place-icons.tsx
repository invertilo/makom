"use client";

import type { PlaceType } from "@/types";
import { cn } from "@/lib/utils";

const paths: Record<PlaceType, React.ReactNode> = {
  restaurant: (
    <path d="M8 3v10M12 3v6a2 2 0 0 1-4 0V3M16 3v18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" />
  ),
  bakery: (
    <path d="M4 14c2-6 14-6 16 0v2H4v-2Zm2 2v3h12v-3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  butcher: (
    <path d="M7 4h10l-1 6H8L7 4Zm1 6 2 10h4l2-10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  grocery_branch: (
    <path d="M5 7h14l-1 11H6L5 7Zm2 0V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  judaica: (
    <>
      <path d="M12 3v18M5 8h14M7 16h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 5l4 3 4-3M8 19l4-3 4 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  synagogue: (
    <path d="M12 3l2.2 4.4L19 8.2l-3.5 3.4.8 4.9L12 14.3 7.7 16.5l.8-4.9L5 8.2l4.8-.8L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  ),
  mikvah: (
    <path d="M4 14c2 2 4 3 8 3s6-1 8-3M6 10c1.5 1.2 3 1.8 6 1.8s4.5-.6 6-1.8M8 6c1 .7 2 1 4 1s3-.3 4-1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" />
  ),
  school: (
    <path d="M3 10l9-5 9 5-9 5-9-5Zm3 3v5l6 3 6-3v-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  hotel: (
    <path d="M4 19V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12M4 19h16M8 10h.01M12 10h.01M8 14h.01M12 14h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" />
  ),
  community: (
    <path d="M4 19V9l8-5 8 5v10M9 19v-5h6v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

export function PlaceTypeIcon({
  type,
  className,
}: {
  type: PlaceType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden
    >
      {paths[type]}
    </svg>
  );
}

export function MapPinMarker({
  type,
  tone,
  selected,
  label,
}: {
  type: PlaceType;
  tone: "seal" | "reported" | "muted" | "danger" | "default";
  selected?: boolean;
  label: string;
}) {
  const fill =
    tone === "seal"
      ? "var(--seal)"
      : tone === "reported"
        ? "var(--reported)"
        : tone === "danger"
          ? "var(--destructive)"
          : "var(--foreground)";

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "group relative flex h-11 w-9 items-end justify-center bg-transparent p-0 transition-transform duration-200",
        selected && "scale-110",
      )}
    >
      <span className="relative drop-shadow-[0_4px_10px_rgba(28,36,48,0.28)]">
        <svg width="36" height="44" viewBox="0 0 36 44" aria-hidden>
          <path
            d="M18 1.5c8 0 14.5 6.4 14.5 14.3 0 10.2-11.4 23.4-13.7 26a1.2 1.2 0 0 1-1.6 0C15 39.2 3.5 26 3.5 15.8 3.5 7.9 10 1.5 18 1.5Z"
            fill={fill}
          />
          <circle cx="18" cy="16" r="9.5" fill="white" />
        </svg>
        <span
          className="absolute left-1/2 top-[7px] -translate-x-1/2 text-[var(--seal)]"
          style={{ color: fill }}
        >
          <PlaceTypeIcon type={type} className="h-[15px] w-[15px]" />
        </span>
      </span>
    </button>
  );
}
