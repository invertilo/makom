"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  addMessage,
  getThreadMessages,
  reportMessage,
} from "@/lib/data/store";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function PlaceThread({
  title,
  threadKey,
}: {
  title: string;
  threadKey: string;
}) {
  const t = useTranslations("chat");
  const { user, signedIn, shabbatLocked } = useAuth();
  const [body, setBody] = useState("");
  const [version, setVersion] = useState(0);
  const messages = getThreadMessages(threadKey);
  void version;

  return (
    <section className="space-y-3 rounded-xl border border-border p-3">
      <h3 className="font-semibold">{title}</h3>
      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {messages.length === 0 && (
          <li className="text-sm text-muted-foreground">{t("empty")}</li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{m.authorName}</span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-destructive"
                onClick={() => {
                  reportMessage(m.id);
                  setVersion((v) => v + 1);
                  toast.message(t("report"));
                }}
              >
                {t("report")}
              </button>
            </div>
            <p className="mt-0.5 whitespace-pre-wrap">{m.body}</p>
          </li>
        ))}
      </ul>

      {!signedIn && (
        <p className="text-sm text-muted-foreground">{t("signIn")}</p>
      )}
      {shabbatLocked && (
        <p className="text-sm text-reported">{t("shabbatLocked")}</p>
      )}
      {signedIn && !shabbatLocked && (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!user) return;
            const result = addMessage(threadKey, user, body);
            if (!result.ok) {
              toast.error(
                result.error === "rate_limit" ? t("rateLimit") : result.error,
              );
              return;
            }
            setBody("");
            setVersion((v) => v + 1);
          }}
        >
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("placeholder")}
            maxLength={500}
          />
          <Button type="submit">{t("send")}</Button>
        </form>
      )}
    </section>
  );
}
