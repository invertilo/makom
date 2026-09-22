import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4 py-2",
  {
    variants: {
      variant: {
        default: "bg-seal text-primary-foreground hover:bg-[var(--color-seal-light)]",
        secondary: "bg-surface-3 text-foreground hover:bg-border",
        outline:
          "border border-[var(--sign-rule)] bg-transparent text-foreground hover:border-seal hover:bg-seal-dim",
        ghost: "hover:bg-surface-3 text-ink-2 hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        seal: "bg-seal text-primary-foreground hover:bg-[var(--color-seal-light)]",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 min-h-9 px-3 text-xs",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
