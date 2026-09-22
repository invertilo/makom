import { setRequestLocale } from "next-intl/server";
import { LandingHero } from "@/components/layout/landing-hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingHero />;
}
