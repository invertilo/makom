"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPinned, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextMorph } from "@/components/ui/text-morph";
import { Sign, Plate } from "@/components/ui/sign";
import { getPlaces, getCommunities } from "@/lib/data/store";
import { PlaceTypeIcon } from "@/components/map/place-icons";
import { statusTone } from "@/lib/place-helpers";

export function LandingHero() {
  const t = useTranslations();
  const words = t.raw("landing.morphWords") as string[];
  const places = getPlaces().slice(0, 5);
  const communities = getCommunities().length;
  const certified = getPlaces().filter((p) => p.kashrutStatus === "certified")
    .length;

  return (
    <div className="w-full">
      <section className="container-page pt-10 pb-8 md:pt-14 md:pb-12">
        <Sign corners padding="none" className="overflow-hidden">
          <div className="grid gap-10 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-12 md:gap-10 md:px-14 md:py-16">
            <div className="md:col-span-7 lg:col-span-8">
              <h1 className="display-xl">
                <span className="block">{t("brand.name")}</span>
                <span className="sheen mt-2 block text-[0.55em] font-bold tracking-[-0.03em] md:text-[0.48em]">
                  {t("brand.tagline")}{" "}
                  <TextMorph
                    words={words}
                    className="align-baseline"
                    interval={2800}
                    morphDuration={720}
                  />
                </span>
              </h1>
              <p className="lead mt-6 md:mt-8">{t("landing.subtitle")}</p>
              <p className="mt-4 max-w-xl border-s-2 border-[var(--sign-rule)] ps-4 text-sm text-ink-3">
                {t("brand.disclaimer")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/map">
                    {t("landing.cta")}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/communities">
                    <Users className="h-4 w-4" aria-hidden />
                    {t("nav.communities")}
                  </Link>
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--sign-rule-soft)] pt-6 md:mt-12 md:max-w-lg">
                <div>
                  <dt className="text-sm text-ink-2">{t("nav.map")}</dt>
                  <dd className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground md:text-3xl">
                    <Link href="/map" className="hover:text-seal-ink">
                      {getPlaces().length}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-2">{t("place.status.certified")}</dt>
                  <dd className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground md:text-3xl">
                    {certified}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-2">{t("nav.communities")}</dt>
                  <dd className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground md:text-3xl">
                    <Link href="/communities" className="hover:text-seal-ink">
                      {communities}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-end md:col-span-5 lg:col-span-4 md:justify-end">
              <Sign quiet padding="none" className="w-full overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <p className="label-caps">{t("search.placeholder").split("…")[0]}</p>
                </div>
                <ul>
                  {places.map((place) => (
                    <li key={place.id} className="border-b border-border last:border-0">
                      <Link
                        href={`/map?place=${encodeURIComponent(place.id)}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-3"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-seal-dim text-seal-ink">
                          <PlaceTypeIcon type={place.type} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold">
                            {place.name}
                          </span>
                          <span className="block truncate text-xs text-ink-3">
                            {place.city}
                          </span>
                        </span>
                        <Plate
                          reported={statusTone(place.kashrutStatus) === "reported"}
                          ink={statusTone(place.kashrutStatus) === "default"}
                          className={
                            statusTone(place.kashrutStatus) === "seal"
                              ? undefined
                              : statusTone(place.kashrutStatus) === "danger"
                                ? "bg-destructive text-destructive-foreground"
                                : undefined
                          }
                        >
                          {place.agencyName ??
                            (place.kashrutStatus === "certified"
                              ? "✓"
                              : place.kashrutStatus === "community_report"
                                ? "R"
                                : "—")}
                        </Plate>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border px-4 py-3">
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-seal-ink hover:underline"
                  >
                    <MapPinned className="h-4 w-4" aria-hidden />
                    {t("landing.cta")}
                  </Link>
                </div>
              </Sign>
            </div>
          </div>
        </Sign>
      </section>

      <div className="border-y border-[var(--sign-rule-soft)] py-4 md:py-5">
        <div className="container-page overflow-hidden">
          <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink-3 md:text-4xl whitespace-nowrap animate-[marquee_40s_linear_infinite]">
            {[
              t("search.eat"),
              t("search.shop"),
              t("search.kehilla"),
              t("search.tefilla"),
              "OU",
              "Badatz",
              "Chabad",
              "Ashkenaz",
              "Sefarad",
              t("search.eat"),
              t("search.shop"),
              t("search.kehilla"),
              t("search.tefilla"),
            ].join("  ·  ")}
          </p>
        </div>
      </div>
    </div>
  );
}
