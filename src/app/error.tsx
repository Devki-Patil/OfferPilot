"use client"

import { useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App render failed.", error)
  }, [error])

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-4xl gap-6">
        <div>
          <Badge variant="destructive">Application error</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            OfferPilot AI could not render
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Retry the page. The detailed error has been logged in the runtime
            console.
          </p>
        </div>
        <Card className="border-destructive/20">
          <CardHeader>
          <CardTitle>Unexpected render error</CardTitle>
          <CardDescription>
              Your workspace is still available after you retry.
          </CardDescription>
            <Button className="mt-4 w-fit" onClick={reset}>
              Retry
            </Button>
          </CardHeader>
        </Card>
      </section>
    </main>
  )
}
