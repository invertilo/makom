"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Denomination, OrthodoxStream } from "@/types";

export default function AccountPage() {
  const t = useTranslations();
  const { user, signedIn, signIn, signOut, patchUser, shabbatLocked } =
    useAuth();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("account.title")}</h1>

      {!signedIn && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">{t("account.guest")}</p>
          <Button onClick={signIn}>{t("account.signIn")}</Button>
        </div>
      )}

      {signedIn && user && (
        <div className="mt-6 space-y-4">
          <p className="text-sm">
            <span className="text-muted-foreground">{t("account.role")}: </span>
            {t(`roles.${user.role}`)}
          </p>

          {shabbatLocked && (
            <p className="rounded-lg bg-reported/15 px-3 py-2 text-sm text-reported">
              {t("account.shabbatActive")}
            </p>
          )}

          <div className="space-y-1">
            <Label htmlFor="denom">{t("account.denomination")}</Label>
            <select
              id="denom"
              className="h-11 w-full rounded-lg border border-border bg-card px-2 text-sm"
              value={user.denomination ?? ""}
              onChange={(e) =>
                patchUser({
                  denomination: (e.target.value || undefined) as
                    | Denomination
                    | undefined,
                })
              }
            >
              <option value="">—</option>
              <option value="orthodox">{t("denomination.orthodox")}</option>
              <option value="conservative">
                {t("denomination.conservative")}
              </option>
              <option value="other">{t("denomination.other")}</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="stream">{t("account.stream")}</Label>
            <select
              id="stream"
              className="h-11 w-full rounded-lg border border-border bg-card px-2 text-sm"
              value={user.orthodoxStream ?? ""}
              onChange={(e) =>
                patchUser({
                  orthodoxStream: (e.target.value || undefined) as
                    | OrthodoxStream
                    | undefined,
                })
              }
            >
              <option value="">—</option>
              {(
                [
                  "modern",
                  "yeshivish",
                  "chabad",
                  "hasidic",
                  "sephardi",
                  "other",
                ] as OrthodoxStream[]
              ).map((s) => (
                <option key={s} value={s}>
                  {t(`stream.${s}`)}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border p-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={user.shabbatMode}
              onChange={(e) => patchUser({ shabbatMode: e.target.checked })}
            />
            <span>
              <span className="block font-medium">{t("account.shabbatMode")}</span>
              <span className="text-sm text-muted-foreground">
                {t("account.shabbatHint")}
              </span>
            </span>
          </label>

          <Button variant="outline" onClick={signOut}>
            {t("account.signOut")}
          </Button>
        </div>
      )}
    </div>
  );
}
