"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Place, StockCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  addStockReport,
  confirmStock,
  getStockForPlace,
  isStockStale,
  placeThreadKey,
  cityThreadKey,
} from "@/lib/data/store";
import { buildStatusLine, statusTone } from "@/lib/place-helpers";
import { PlaceTypeIcon } from "@/components/map/place-icons";
import { useAuth } from "@/components/auth/auth-provider";
import { PlaceThread } from "@/components/chat/place-thread";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STOCK_CATS: StockCategory[] = [
  "meat",
  "wine",
  "matzah",
  "cheese",
  "frozen",
  "bakery",
];

export function PlacePanel({
  place,
  onSuggestEdit,
}: {
  place: Place;
  onSuggestEdit?: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { user, signedIn, shabbatLocked } = useAuth();
  const [stockNote, setStockNote] = useState("");
  const [stockCat, setStockCat] = useState<StockCategory>("wine");
  const [version, setVersion] = useState(0);
  const stock = getStockForPlace(place.id);
  void version;

  const canWrite = signedIn && !shabbatLocked;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl",
              statusTone(place.kashrutStatus) === "seal" && "bg-seal/12 text-seal",
              statusTone(place.kashrutStatus) === "reported" &&
                "bg-reported/12 text-reported",
              statusTone(place.kashrutStatus) === "danger" &&
                "bg-destructive/12 text-destructive",
              (statusTone(place.kashrutStatus) === "default" ||
                statusTone(place.kashrutStatus) === "muted") &&
                "bg-muted text-muted-foreground",
            )}
          >
            <PlaceTypeIcon type={place.type} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold leading-tight tracking-[-0.02em] md:text-base">
              {place.name}
            </h2>
            {place.nameLocal && (
              <p className="text-sm text-muted-foreground">{place.nameLocal}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {place.address}
              <br />
              {place.city}, {place.country}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone={statusTone(place.kashrutStatus)}>
            {t(`place.status.${place.kashrutStatus}`)}
          </Badge>
          <Badge>{t(`place.types.${place.type}`)}</Badge>
          {place.foodCategory && (
            <Badge tone="muted">{t(`place.food.${place.foodCategory}`)}</Badge>
          )}
        </div>
        <p className="mt-2 text-sm font-medium text-seal">
          {buildStatusLine(place, locale, t)}
        </p>
        {place.notes && (
          <p className="mt-2 text-sm text-muted-foreground">{place.notes}</p>
        )}
        {place.chainName && place.type === "grocery_branch" && (
          <p className="mt-2 rounded-lg bg-reported/10 px-3 py-2 text-xs text-reported">
            {place.chainName}: {t("place.branchNote")}
          </p>
        )}
      </div>

      {(place.nusach || place.denomination || place.prayerTimes) && (
        <section className="space-y-2 rounded-xl border border-border p-3">
          {place.nusach && (
            <p className="text-sm">
              <span className="text-muted-foreground">{t("place.nusach")}: </span>
              {t(`nusach.${place.nusach}`)}
            </p>
          )}
          {place.denomination && (
            <p className="text-sm">
              <span className="text-muted-foreground">
                {t("place.denomination")}:{" "}
              </span>
              {t(`denomination.${place.denomination}`)}
            </p>
          )}
          {place.orthodoxStream && (
            <p className="text-sm">
              <span className="text-muted-foreground">{t("place.stream")}: </span>
              {t(`stream.${place.orthodoxStream}`)}
            </p>
          )}
          {place.prayerTimes && (
            <div className="text-sm">
              <p className="font-medium">{t("place.prayerTimes")}</p>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                {place.prayerTimes.shacharit && (
                  <li>
                    {t("place.shacharit")}: {place.prayerTimes.shacharit}
                  </li>
                )}
                {place.prayerTimes.mincha && (
                  <li>
                    {t("place.mincha")}: {place.prayerTimes.mincha}
                  </li>
                )}
                {place.prayerTimes.maariv && (
                  <li>
                    {t("place.maariv")}: {place.prayerTimes.maariv}
                  </li>
                )}
              </ul>
            </div>
          )}
        </section>
      )}

      {place.type === "grocery_branch" && (
        <section className="space-y-3">
          <h3 className="font-semibold">{t("place.stock")}</h3>
          <ul className="space-y-2">
            {stock.length === 0 && (
              <li className="text-sm text-muted-foreground">—</li>
            )}
            {stock.map((report) => {
              const stale = isStockStale(report);
              return (
                <li
                  key={report.id}
                  className="rounded-xl border border-border p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={stale ? "reported" : "seal"}>
                      {t(`stock.categories.${report.category}`)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stale ? t("place.stockStale") : t("place.stockFresh")}
                    </span>
                  </div>
                  <p className="mt-1">{report.note}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {report.authorName} · {report.confirmations} ✓
                  </p>
                  {canWrite && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        confirmStock(report.id);
                        setVersion((v) => v + 1);
                        toast.success(t("place.confirmStock"));
                      }}
                    >
                      {t("place.confirmStock")}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>

          {canWrite ? (
            <form
              className="space-y-2 rounded-xl border border-dashed border-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!user || !stockNote.trim()) return;
                addStockReport({
                  placeId: place.id,
                  category: stockCat,
                  note: stockNote.trim(),
                  authorName: user.displayName,
                });
                setStockNote("");
                setVersion((v) => v + 1);
                toast.success(t("stock.submit"));
              }}
            >
              <p className="text-sm font-medium">{t("place.addStock")}</p>
              <Label htmlFor="stock-cat">{t("stock.categories.wine")}</Label>
              <select
                id="stock-cat"
                className="h-11 w-full rounded-lg border border-border bg-card px-2 text-sm"
                value={stockCat}
                onChange={(e) => setStockCat(e.target.value as StockCategory)}
              >
                {STOCK_CATS.map((c) => (
                  <option key={c} value={c}>
                    {t(`stock.categories.${c}`)}
                  </option>
                ))}
              </select>
              <Textarea
                value={stockNote}
                onChange={(e) => setStockNote(e.target.value)}
                placeholder={t("stock.note")}
              />
              <Button type="submit">{t("stock.submit")}</Button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground">
              {shabbatLocked
                ? t("chat.shabbatLocked")
                : t("stock.signInRequired")}
            </p>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onSuggestEdit}>
          {t("place.suggestEdit")}
        </Button>
      </div>

      <PlaceThread
        title={t("place.thread")}
        threadKey={placeThreadKey(place.id)}
      />
      <PlaceThread
        title={t("place.cityThread")}
        threadKey={cityThreadKey(place.city, place.countryCode)}
      />
    </div>
  );
}
