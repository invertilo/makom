"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { PlaceType } from "@/types";
import { addPlace } from "@/lib/data/store";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TYPES: PlaceType[] = [
  "restaurant",
  "bakery",
  "butcher",
  "grocery_branch",
  "judaica",
  "synagogue",
  "mikvah",
  "school",
  "hotel",
  "community",
];

export default function SuggestPage() {
  const t = useTranslations();
  const router = useRouter();
  const { signedIn, shabbatLocked } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState<PlaceType>("restaurant");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-sm text-muted-foreground">
        {t("stock.signInRequired")}
      </div>
    );
  }
  if (shabbatLocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-sm text-reported">
        {t("chat.shabbatLocked")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("suggest.title")}</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const place = addPlace({
            name,
            type,
            address,
            city,
            country,
            countryCode: country.slice(0, 2).toUpperCase() || "XX",
            lat: Number(lat) || 0,
            lng: Number(lng) || 0,
            notes: notes || undefined,
            kashrutStatus: "community_report",
          });
          toast.success(t("suggest.success"));
          router.push(`/map?place=${encodeURIComponent(place.id)}`);
        }}
      >
        <Field label={t("suggest.name")}>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field label={t("suggest.type")}>
          <select
            className="h-11 w-full rounded-lg border border-border bg-card px-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as PlaceType)}
          >
            {TYPES.map((tp) => (
              <option key={tp} value={tp}>
                {t(`place.types.${tp}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("suggest.address")}>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </Field>
        <Field label={t("suggest.city")}>
          <Input value={city} onChange={(e) => setCity(e.target.value)} required />
        </Field>
        <Field label={t("suggest.country")}>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("suggest.lat")}>
            <Input value={lat} onChange={(e) => setLat(e.target.value)} required />
          </Field>
          <Field label={t("suggest.lng")}>
            <Input value={lng} onChange={(e) => setLng(e.target.value)} required />
          </Field>
        </div>
        <Field label={t("suggest.notes")}>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button type="submit">{t("suggest.submit")}</Button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
