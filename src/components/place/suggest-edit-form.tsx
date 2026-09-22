"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Place } from "@/types";
import { addEditSuggestion } from "@/lib/data/store";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SuggestEditForm({
  place,
  onDone,
}: {
  place: Place;
  onDone: () => void;
}) {
  const t = useTranslations();
  const { user, signedIn, shabbatLocked } = useAuth();
  const [field, setField] = useState("notes");
  const [newValue, setNewValue] = useState("");
  const [reason, setReason] = useState("");

  if (!signedIn) {
    return <p className="text-sm text-muted-foreground">{t("stock.signInRequired")}</p>;
  }
  if (shabbatLocked) {
    return <p className="text-sm text-reported">{t("chat.shabbatLocked")}</p>;
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!user || !newValue.trim()) return;
        const oldValue = String(
          (place as unknown as Record<string, unknown>)[field] ?? "",
        );
        addEditSuggestion({
          placeId: place.id,
          authorName: user.displayName,
          field,
          oldValue,
          newValue: newValue.trim(),
          note: reason.trim() || undefined,
        });
        toast.success(t("suggest.submit"));
        onDone();
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="field">{t("suggest.field")}</Label>
        <select
          id="field"
          className="h-11 w-full rounded-lg border border-border bg-card px-2 text-sm"
          value={field}
          onChange={(e) => setField(e.target.value)}
        >
          <option value="notes">notes</option>
          <option value="kashrutStatus">kashrutStatus</option>
          <option value="agencyName">agencyName</option>
          <option value="address">address</option>
          <option value="phone">phone</option>
        </select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="newValue">{t("suggest.newValue")}</Label>
        <Input
          id="newValue"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="reason">{t("suggest.reason")}</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      <Button type="submit">{t("suggest.submit")}</Button>
    </form>
  );
}
