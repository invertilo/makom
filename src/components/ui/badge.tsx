import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "seal" | "reported" | "muted" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-2 py-0.5 text-xs font-semibold leading-5",
        tone === "default" && "border-border bg-surface-3 text-ink-2",
        tone === "seal" &&
          "border-transparent bg-seal text-primary-foreground",
        tone === "reported" &&
          "border-transparent bg-[var(--color-reported)] text-[var(--reported-foreground)]",
        tone === "muted" && "border-border bg-transparent text-ink-3",
        tone === "danger" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
        className,
      )}
      {...props}
    />
  );
}
