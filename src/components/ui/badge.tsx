import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border-border bg-secondary text-secondary-foreground shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset]",
        outline: "border-border bg-transparent text-muted-foreground",
        success:
          "border-emerald-400/16 bg-emerald-400/8 text-emerald-200",
        warning: "border-amber-400/16 bg-amber-400/8 text-amber-200",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
