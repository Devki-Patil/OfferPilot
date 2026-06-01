import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SectionMetric = {
  label: string
  value: string
}

type SectionItem = {
  description: string
  label: string
  status: string
}

export function DashboardSectionPage({
  badge,
  description,
  icon: Icon,
  items,
  metrics,
  title,
}: {
  badge: string
  description: string
  icon: LucideIcon
  items: SectionItem[]
  metrics: SectionMetric[]
  title: string
}) {
  return (
    <section className="grid gap-6">
      <div>
        <Badge variant="outline">{badge}</Badge>
        <h1 className="mt-3 flex items-center gap-2 text-3xl font-semibold text-white">
          <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="font-analytics text-2xl font-semibold text-white">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace queue</CardTitle>
          <CardDescription>
            Lightweight demo data keeps this route useful while live integrations
            are connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            {items.map((item) => (
              <div
                key={item.label}
                className="grid gap-3 border-b border-border bg-graphite px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_9rem]"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="self-center sm:text-right">
                  <Badge variant="outline">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
