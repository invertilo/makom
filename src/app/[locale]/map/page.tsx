import { setRequestLocale } from "next-intl/server";
import { MapExperience } from "@/components/map/map-experience";

export default async function MapPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ place?: string; city?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return <MapExperience initialPlaceId={sp.place} initialCity={sp.city} />;
}
