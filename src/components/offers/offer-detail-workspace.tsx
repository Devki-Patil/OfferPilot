"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BriefcaseBusiness, CalendarClock, MapPin, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockOffers } from "@/features/offers/data"
import type { Offer } from "@/features/offers/types"

const storageKey = "offerpilot.offers.v1"

export function OfferDetailWorkspace({ fallbackOffer }: { fallbackOffer: Offer | null }) {
  const [offer, setOffer] = useState<Offer | null>(fallbackOffer)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)

    if (!saved) {
      return
    }

    try {
      const offers = JSON.parse(saved) as Offer[]
      const localOffer = offers.find((item) => item.id === fallbackOffer?.id)

      setOffer(localOffer ?? fallbackOffer)
    } catch {
      setOffer(fallbackOffer)
    }
  }, [fallbackOffer])

  if (!offer) {
    return (
      <section className="grid gap-6">
        <PageHeader
          badge="Offer details"
          description="This offer could not be found in the seeded or local workspace data."
          icon={BriefcaseBusiness}
          title="Offer not found"
        />
        <Button asChild className="w-fit" variant="outline">
          <Link href="/offers">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to offers
          </Link>
        </Button>
      </section>
    )
  }

  const related = mockOffers.filter((item) => item.id !== offer.id).slice(0, 3)

  return (
    <section className="grid gap-6">
      <PageHeader
        action={
          <Button asChild variant="outline">
            <Link href="/offers">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to offers
            </Link>
          </Button>
        }
        badge="Offer details"
        description="Review the role, decision context, score, and next action for this opportunity."
        icon={BriefcaseBusiness}
        title={`${offer.company} · ${offer.role}`}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <DetailMetric icon={BriefcaseBusiness} label="Status" value={offer.status} />
        <DetailMetric icon={Wallet} label="Compensation" value={offer.compensation} />
        <DetailMetric icon={MapPin} label="Location" value={offer.location} />
        <DetailMetric icon={CalendarClock} label="Applied" value={offer.appliedAt} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Decision notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Next step
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{offer.nextStep}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI fit score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <span className="font-analytics text-5xl font-semibold text-white">
                {offer.score}
              </span>
              <span className="pb-2 text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-white/75"
                style={{ width: `${offer.score}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Score combines role alignment, skills overlap, and offer-stage urgency using mocked
              scoring until a backend scoring table is connected.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nearby opportunities</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.id}
              href={`/offers/${item.id}`}
              className="rounded-lg border border-border bg-graphite p-4 transition-colors hover:bg-graphite-elevated"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{item.company}</p>
                <Badge variant="outline">{item.status}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.role}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}

function DetailMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-sm font-medium text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
