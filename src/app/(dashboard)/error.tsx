"use client"

import { useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard route failed.", error)
  }, [error])

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <Badge variant="destructive">Workspace error</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Workspace could not render
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Retry the workspace route. The detailed error has been logged in the
          runtime console.
        </p>
      </div>

      <Card className="border-destructive/20 bg-card/90">
        <CardHeader>
          <CardTitle>Unexpected workspace error</CardTitle>
          <CardDescription>
            Your dashboard can be loaded again without leaving the workspace.
          </CardDescription>
          <Button className="mt-4 w-fit" onClick={reset}>
            Retry
          </Button>
        </CardHeader>
      </Card>
    </section>
  )
}
