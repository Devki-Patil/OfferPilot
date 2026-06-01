"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard render failed.", error)
  }, [error])

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <Badge variant="destructive">Dashboard error</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Dashboard could not render
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          The dashboard hit a render-time error. Retry after checking the dev
          console for the logged stack trace.
        </p>
      </div>

      <Card className="border-destructive/20 bg-card/90">
        <CardHeader>
          <CardTitle>Unexpected dashboard error</CardTitle>
          <CardDescription>
            Retry the dashboard. The detailed error has been logged outside the
            user interface.
          </CardDescription>
          <Button className="mt-4 w-fit" onClick={reset}>
            Retry
          </Button>
        </CardHeader>
      </Card>
    </section>
  )
}
