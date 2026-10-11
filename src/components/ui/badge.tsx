import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Tonen volgen het ESTG-designsysteem. Een badge draagt altijd een woord of icoon, nooit alleen kleur.
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] leading-4 font-semibold tracking-[0.02em]",
  {
    variants: {
      tone: {
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-100 text-warning-700",
        danger: "bg-danger-100 text-danger-700",
        info: "bg-navy-100 text-navy-900",
        accent: "bg-yellow-400 text-navy-900",
      },
    },
    defaultVariants: {
      tone: "info",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
