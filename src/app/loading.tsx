import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AppLoading() {
  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-6">
        <div>
          <Badge variant="outline">OfferPilot AI</Badge>
          <div className="mt-4 h-9 w-64 rounded-md bg-white/10" />
          <div className="mt-3 h-4 w-full max-w-xl rounded-full bg-white/8" />
        </div>
        <Card>
          <CardHeader>
            <div className="h-5 w-48 rounded-full bg-white/10" />
            <div className="h-4 w-72 rounded-full bg-white/8" />
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 rounded-lg border border-border bg-graphite" />
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
