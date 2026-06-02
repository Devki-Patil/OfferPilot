"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  BriefcaseBusiness,
  Edit3,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal"
import { offerStatuses, type Offer, type OfferStatus } from "@/features/offers/types"

const storageKey = "offerpilot.offers.v1"

const emptyOffer: Omit<Offer, "id"> = {
  company: "",
  role: "",
  location: "Remote",
  compensation: "",
  status: "Applied",
  owner: "Devki",
  appliedAt: new Date().toISOString().slice(0, 10),
  nextStep: "",
  score: 80,
  notes: "",
}

export function OffersWorkspace({ initialOffers }: { initialOffers: Offer[] }) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<OfferStatus | "All">("All")
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Offer[]

        if (Array.isArray(parsed)) {
          setOffers(parsed)
        }
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(offers))
  }, [offers])

  const filteredOffers = useMemo(() => {
    const search = query.trim().toLowerCase()

    return offers.filter((offer) => {
      const matchesStatus = status === "All" || offer.status === status
      const matchesQuery =
        !search ||
        [offer.company, offer.role, offer.location, offer.owner]
          .join(" ")
          .toLowerCase()
          .includes(search)

      return matchesStatus && matchesQuery
    })
  }, [offers, query, status])

  const metrics = useMemo(
    () => [
      { label: "Tracked offers", value: `${offers.length}` },
      {
        label: "Interviewing",
        value: `${offers.filter((offer) => offer.status === "Interview").length}`,
      },
      {
        label: "Avg score",
        value: `${Math.round(
          offers.reduce((total, offer) => total + offer.score, 0) /
            Math.max(offers.length, 1),
        )}`,
      },
    ],
    [offers],
  )

  function openCreateModal() {
    setEditingOffer(null)
    setIsModalOpen(true)
  }

  function openEditModal(offer: Offer) {
    setEditingOffer(offer)
    setIsModalOpen(true)
  }

  function saveOffer(values: Omit<Offer, "id">) {
    if (editingOffer) {
      setOffers((current) =>
        current.map((offer) =>
          offer.id === editingOffer.id ? { ...values, id: editingOffer.id } : offer,
        ),
      )
    } else {
      setOffers((current) => [
        {
          ...values,
          id: `${values.company}-${values.role}-${Date.now()}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        },
        ...current,
      ])
    }

    setIsModalOpen(false)
  }

  function deleteOffer(offerId: string) {
    setOffers((current) => current.filter((offer) => offer.id !== offerId))
  }

  return (
    <section className="grid gap-6">
      <PageHeader
        action={
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button onClick={openCreateModal}>
                <Plus className="size-4" aria-hidden="true" />
                Add offer
              </Button>
            </ModalTrigger>
            <OfferFormModal
              initialOffer={editingOffer ?? emptyOffer}
              mode={editingOffer ? "Edit offer" : "Add offer"}
              onSave={saveOffer}
            />
          </Modal>
        }
        badge="Offers"
        description="Track offers from application through decision, with local CRUD while a full offers backend is added."
        icon={BriefcaseBusiness}
        title="Offers"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="font-analytics text-2xl font-semibold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Offer tracker</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative min-w-0 sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search offers"
                  className="pl-9"
                />
              </label>
              <label className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as OfferStatus | "All")}
                  className="h-9 rounded-md border border-input bg-graphite pl-9 pr-8 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  <option>All</option>
                  {offerStatuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOffers.length ? (
            <div className="overflow-hidden rounded-lg border border-border">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid gap-4 border-b border-border bg-graphite px-4 py-4 last:border-b-0 xl:grid-cols-[1fr_9rem_8rem_8rem]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{offer.company}</p>
                      <Badge variant={statusVariant(offer.status)}>{offer.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{offer.role}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {offer.nextStep}
                    </p>
                  </div>
                  <div className="self-center text-sm">
                    <p className="text-foreground">{offer.compensation}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{offer.location}</p>
                  </div>
                  <div className="self-center">
                    <p className="font-analytics text-lg font-semibold text-white">
                      {offer.score}
                    </p>
                    <p className="text-xs text-muted-foreground">AI score</p>
                  </div>
                  <div className="flex items-center gap-2 self-center xl:justify-end">
                    <Button asChild variant="outline" size="icon" aria-label="View offer">
                      <Link href={`/offers/${offer.id}`}>
                        <Eye className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit offer"
                      onClick={() => openEditModal(offer)}
                    >
                      <Edit3 className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      aria-label="Delete offer"
                      onClick={() => deleteOffer(offer.id)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              action="Clear filters"
              description="No offers match the current search and status filters."
              icon={BriefcaseBusiness}
              title="No offers found"
            />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function OfferFormModal({
  initialOffer,
  mode,
  onSave,
}: {
  initialOffer: Omit<Offer, "id">
  mode: string
  onSave: (offer: Omit<Offer, "id">) => void
}) {
  const [draft, setDraft] = useState<Omit<Offer, "id">>(initialOffer)

  useEffect(() => {
    setDraft(initialOffer)
  }, [initialOffer])

  function update<Value extends keyof Omit<Offer, "id">>(
    key: Value,
    value: Omit<Offer, "id">[Value],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{mode}</ModalTitle>
        <ModalDescription>
          Keep the offer pipeline current with status, compensation, and next action.
        </ModalDescription>
      </ModalHeader>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(draft)
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company">
            <Input
              required
              value={draft.company}
              onChange={(event) => update("company", event.target.value)}
            />
          </Field>
          <Field label="Role">
            <Input
              required
              value={draft.role}
              onChange={(event) => update("role", event.target.value)}
            />
          </Field>
          <Field label="Location">
            <Input
              value={draft.location}
              onChange={(event) => update("location", event.target.value)}
            />
          </Field>
          <Field label="Compensation">
            <Input
              value={draft.compensation}
              onChange={(event) => update("compensation", event.target.value)}
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(event) => update("status", event.target.value as OfferStatus)}
              className="h-9 rounded-md border border-input bg-graphite px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {offerStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Score">
            <Input
              max={100}
              min={0}
              type="number"
              value={draft.score}
              onChange={(event) => update("score", Number(event.target.value))}
            />
          </Field>
        </div>
        <Field label="Next step">
          <Input
            value={draft.nextStep}
            onChange={(event) => update("nextStep", event.target.value)}
          />
        </Field>
        <Field label="Notes">
          <textarea
            value={draft.notes}
            onChange={(event) => update("notes", event.target.value)}
            rows={4}
            className="min-h-24 rounded-md border border-input bg-graphite px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </Field>
        <ModalFooter>
          <ModalClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </ModalClose>
          <Button type="submit">Save offer</Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function statusVariant(status: OfferStatus) {
  if (status === "Offer") {
    return "success"
  }

  if (status === "Rejected") {
    return "destructive"
  }

  if (status === "Interview") {
    return "warning"
  }

  return "outline"
}
