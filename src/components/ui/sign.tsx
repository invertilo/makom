import * as React from "react";
import { cn } from "@/lib/utils";

export interface SignProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  corners?: boolean;
  quiet?: boolean;
  flat?: boolean;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-10",
};

export const Sign = React.forwardRef<HTMLDivElement, SignProps>(
  (
    {
      as: Comp = "div",
      corners = false,
      quiet = false,
      flat = false,
      interactive = false,
      padding = "md",
      className,
      ...props
    },
    ref,
  ) => (
    <Comp
      ref={ref}
      className={cn(
        "sign",
        corners && "sign-corners",
        quiet && "sign-quiet",
        flat && "sign-flat",
        interactive && "sign-interactive",
        paddings[padding],
        className,
      )}
      {...props}
    />
  ),
);
Sign.displayName = "Sign";

export function Plate({
  className,
  ink = false,
  reported = false,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  ink?: boolean;
  reported?: boolean;
}) {
  return (
    <span
      className={cn(
        reported ? "plate-reported" : ink ? "plate-ink" : "plate",
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.06em] leading-none",
        className,
      )}
      {...props}
    />
  );
}

export function Rule({
  seal = false,
  className,
}: {
  seal?: boolean;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      className={cn(seal ? "rule-seal" : "rule", "w-full", className)}
    />
  );
}
