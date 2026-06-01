import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
  return (
    <section className="flex flex-1 flex-col gap-8">
      <div>
        <Badge variant="outline">Workspace</Badge>
        <div className="mt-4 h-9 w-72 rounded-md bg-white/10" />
        <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-white/8" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        {[0, 1].map((item) => (
          <Card key={item} className="bg-card/90">
            <CardHeader>
              <div className="h-5 w-48 rounded-full bg-white/10" />
              <div className="h-4 w-64 rounded-full bg-white/8" />
            </CardHeader>
            <CardContent className="grid gap-3">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="h-24 rounded-lg border border-border bg-graphite"
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
