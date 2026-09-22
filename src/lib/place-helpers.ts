import type { KashrutStatus, Place, PlaceType } from "@/types";
import { formatRelativeDays } from "@/lib/utils";

export function statusTone(
  status: KashrutStatus,
): "seal" | "reported" | "muted" | "danger" | "default" {
  switch (status) {
    case "certified":
      return "seal";
    case "community_report":
      return "reported";
    case "disputed":
      return "danger";
    case "closed":
      return "muted";
    default:
      return "default";
  }
}

export function placeSymbol(type: PlaceType): string {
  // Kept for legacy string contexts; UI uses PlaceTypeIcon.
  switch (type) {
    case "restaurant":
      return "R";
    case "bakery":
      return "B";
    case "butcher":
      return "M";
    case "grocery_branch":
      return "G";
    case "judaica":
      return "J";
    case "synagogue":
      return "S";
    case "mikvah":
      return "V";
    case "school":
      return "E";
    case "hotel":
      return "H";
    case "community":
      return "C";
    default:
      return "•";
  }
}

export function buildStatusLine(
  place: Place,
  locale: string,
  t: (key: string, values?: Record<string, string>) => string,
): string {
  if (place.type === "synagogue" && place.prayerTimes?.mincha) {
    return t("place.statusLineSynagogue", {
      time: place.prayerTimes.mincha,
      nusach: place.nusach ? t(`nusach.${place.nusach}`) : "—",
      stream: place.orthodoxStream
        ? t(`stream.${place.orthodoxStream}`)
        : place.denomination
          ? t(`denomination.${place.denomination}`)
          : "—",
    });
  }

  const when = place.confirmedAt
    ? formatRelativeDays(place.confirmedAt, locale)
    : "—";
  const food = place.foodCategory
    ? t(`place.food.${place.foodCategory}`)
    : "—";

  if (place.kashrutStatus === "certified" && place.agencyName) {
    return t("place.statusLine", {
      agency: place.agencyName,
      food,
      when,
    });
  }

  if (place.kashrutStatus === "community_report") {
    return t("place.statusLineReport", { food, when });
  }

  return `${t(`place.status.${place.kashrutStatus}`)} · ${food}`;
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
