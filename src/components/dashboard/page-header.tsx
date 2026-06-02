import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function PageHeader({
  badge,
  description,
  icon: Icon,
  title,
  action,
}: {
  action?: ReactNode
  badge: string
  description: string
  icon?: LucideIcon
  title: string
}) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <Badge variant="outline">{badge}</Badge>
        <h1 className="mt-3 flex items-center gap-2 text-3xl font-semibold text-white">
          {Icon && <Icon className="size-6 text-muted-foreground" aria-hidden="true" />}
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
