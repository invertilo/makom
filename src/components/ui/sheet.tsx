"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

export function SheetContent({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-md border border-[var(--sign-rule)] bg-sheet shadow-[var(--shadow-lg)] outline-none md:inset-y-4 md:end-4 md:start-auto md:w-[440px] md:max-h-[calc(100vh-2rem)] md:rounded-sm",
          className,
        )}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border md:hidden" aria-hidden />
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Dialog.Title className="text-base font-semibold md:text-sm">
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Dialog.Close>
        </div>
        <div className="max-h-[calc(85vh-3.5rem)] overflow-y-auto p-4 md:max-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
