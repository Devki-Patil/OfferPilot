import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyState({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: string
  description: string
  icon: LucideIcon
  title: string
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-graphite px-6 py-10 text-center">
      <span className="flex size-10 items-center justify-center rounded-md border border-border bg-secondary">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action && (
        <Button className="mt-5" type="button" variant="outline">
          {action}
        </Button>
      )}
    </div>
  )
}
