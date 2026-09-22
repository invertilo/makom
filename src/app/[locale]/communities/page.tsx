import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCommunities, getPlaces } from "@/lib/data/store";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Sign, Plate } from "@/components/ui/sign";
import { Button } from "@/components/ui/button";
import { MapPinned } from "lucide-react";

export default async function CommunitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const communities = getCommunities();

  return (
    <div>
      <PageHeader
        title={t("communities.title")}
        lead={t("brand.disclaimer")}
      />
      <div className="container-page pb-16">
        <ul className="grid gap-4 sm:grid-cols-2">
          {communities.map((c) => {
            const nearby = getPlaces({ query: c.city }).filter(
              (p) => p.countryCode === c.countryCode,
            );
            return (
              <li key={c.id}>
                <Sign quiet interactive padding="md" className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="display-sm">{c.name}</h2>
                    {c.population != null && (
                      <span className="font-mono text-sm tabular-nums text-seal-ink">
                        {c.population.toLocaleString(locale)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-3">
                    {c.city}, {c.country}
                  </p>
                  {c.populationSource && (
                    <p className="mt-3 text-xs text-ink-3">
                      <span className="label-caps me-2">
                        {t("communities.source")}
                      </span>
                      {c.populationSource}
                      {c.populationYear ? ` · ${c.populationYear}` : ""}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.languages.map((lang) => (
                      <Plate key={lang} ink>
                        {lang}
                      </Plate>
                    ))}
                  </div>
                  {c.denominationNotes && (
                    <p className="mt-3 text-sm text-ink-2">
                      {c.denominationNotes}
                    </p>
                  )}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--sign-rule-soft)] pt-4">
                    <span className="text-sm text-ink-3">
                      {t("communities.placesNearby")}:{" "}
                      <span className="font-mono text-foreground">
                        {nearby.length}
                      </span>
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/map?city=${encodeURIComponent(c.city)}`}>
                        <MapPinned className="h-3.5 w-3.5" aria-hidden />
                        {t("communities.openMap")}
                      </Link>
                    </Button>
                  </div>
                </Sign>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
