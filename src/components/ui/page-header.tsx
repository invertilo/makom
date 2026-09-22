import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}

export function PageHeader({
  title,
  lead,
  children,
  aside,
  size = "lg",
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("container-page pt-8 md:pt-10 pb-8 md:pb-10", className)}>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className={cn("space-y-4", aside ? "md:col-span-7" : "md:col-span-9")}>
          <h1 className={size === "lg" ? "display-lg" : "display-md"}>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
        {aside && <div className="md:col-span-5 md:justify-self-end">{aside}</div>}
      </div>
      {children && <div className="mt-8">{children}</div>}
      <div className="rule-double mt-8 md:mt-10" role="presentation" />
    </header>
  );
}
