"use client"

import { useEffect, useMemo, useState } from "react"
import { GripVertical, KanbanSquare } from "lucide-react"

import { EmptyState } from "@/components/dashboard/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { mockPipelineCards } from "@/features/offers/data"
import { pipelineStages, type PipelineCard, type PipelineStage } from "@/features/offers/types"

const storageKey = "offerpilot.pipeline.v1"

export function PipelineBoard() {
  const [cards, setCards] = useState<PipelineCard[]>(mockPipelineCards)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)

    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved) as PipelineCard[]

      if (Array.isArray(parsed)) {
        setCards(parsed)
      }
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(cards))
  }, [cards])

  const groupedCards = useMemo(
    () =>
      pipelineStages.map((stage) => ({
        cards: cards.filter((card) => card.stage === stage),
        stage,
      })),
    [cards],
  )

  function moveCard(cardId: string, stage: PipelineStage) {
    setCards((current) =>
      current.map((card) => (card.id === cardId ? { ...card, stage } : card)),
    )
  }

  return (
    <section className="grid gap-6">
      <PageHeader
        badge="Pipeline"
        description="Move opportunities through the hiring process with a local drag-and-drop Kanban board."
        icon={KanbanSquare}
        title="Pipeline"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <PipelineMetric label="Active stages" value={`${pipelineStages.length}`} />
        <PipelineMetric label="Open cards" value={`${cards.length}`} />
        <PipelineMetric
          label="Offer rate"
          value={`${Math.round(
            (cards.filter((card) => card.stage === "Offer").length /
              Math.max(cards.length, 1)) *
              100,
          )}%`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-6">
        {groupedCards.map(({ cards: stageCards, stage }) => (
          <div
            key={stage}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const cardId = event.dataTransfer.getData("text/plain") || draggedId

              if (cardId) {
                moveCard(cardId, stage)
              }

              setDraggedId(null)
            }}
            className="min-h-80 rounded-lg border border-border bg-card p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{stage}</p>
              <Badge variant="outline">{stageCards.length}</Badge>
            </div>
            <div className="grid gap-3">
              {stageCards.length ? (
                stageCards.map((card) => (
                  <article
                    key={card.id}
                    draggable
                    onDragStart={(event) => {
                      setDraggedId(card.id)
                      event.dataTransfer.setData("text/plain", card.id)
                    }}
                    onDragEnd={() => setDraggedId(null)}
                    className="rounded-lg border border-border bg-graphite p-4 shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset] transition-colors hover:bg-graphite-elevated"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{card.company}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {card.role}
                        </p>
                      </div>
                      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{card.due}</span>
                      <Badge>{card.score}</Badge>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState
                  description="Drop a card here to move it into this stage."
                  icon={KanbanSquare}
                  title="No cards"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function PipelineMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-analytics text-2xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}
