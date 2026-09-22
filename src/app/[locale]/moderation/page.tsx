"use client";

import { useTranslations } from "next-intl";
import {
  getEdits,
  resolveEdit,
  updateUser,
  getUser,
} from "@/lib/data/store";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

export default function ModerationPage() {
  const t = useTranslations();
  const { user, signedIn, patchUser, refresh } = useAuth();
  const [version, setVersion] = useState(0);
  const edits = getEdits("pending");
  void version;

  const canModerate =
    user?.role === "local_moderator" ||
    user?.role === "admin" ||
    user?.role === "agency";

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-sm text-muted-foreground">
        {t("stock.signInRequired")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t("moderation.title")}</h1>

      {!canModerate && (
        <div className="mt-4 space-y-3 rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t("moderation.forbidden")}</p>
          <Button
            variant="outline"
            onClick={() => {
              const current = getUser();
              if (!current) return;
              updateUser({ role: "local_moderator" });
              patchUser({ role: "local_moderator" });
              refresh();
              toast.success(t("roles.local_moderator"));
            }}
          >
            Demo: become local moderator
          </Button>
        </div>
      )}

      {canModerate && (
        <ul className="mt-6 space-y-3">
          {edits.length === 0 && (
            <li className="text-sm text-muted-foreground">{t("moderation.empty")}</li>
          )}
          {edits.map((edit) => (
            <li key={edit.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{edit.field}</Badge>
                <span className="text-sm text-muted-foreground">
                  {edit.authorName}
                </span>
              </div>
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">{edit.oldValue || "∅"}</span>
                {" → "}
                <span className="font-medium">{edit.newValue}</span>
              </p>
              {edit.note && (
                <p className="mt-1 text-xs text-muted-foreground">{edit.note}</p>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    resolveEdit(edit.id, "accepted");
                    setVersion((v) => v + 1);
                    toast.success(t("moderation.accept"));
                  }}
                >
                  {t("moderation.accept")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    resolveEdit(edit.id, "rejected");
                    setVersion((v) => v + 1);
                    toast.message(t("moderation.reject"));
                  }}
                >
                  {t("moderation.reject")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
