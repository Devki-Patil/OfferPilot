import { BrainCircuit, CheckCircle2, Sparkles, Target, TriangleAlert } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const scoreCards = [
  {
    label: "Resume score",
    value: 88,
    detail: "Clear seniority and measurable product engineering impact.",
  },
  {
    label: "Skills match",
    value: 91,
    detail: "React, TypeScript, AI workflows, and product strategy overlap strongly.",
  },
  {
    label: "ATS score",
    value: 84,
    detail: "Keyword coverage is solid with a few missing domain phrases.",
  },
]

const strengths = [
  "Strong product-engineering positioning with clear AI workflow evidence.",
  "Technical keywords are present in the highest-value resume sections.",
  "Projects show ownership across discovery, implementation, and rollout.",
]

const weaknesses = [
  "Add more quantified outcomes to the two newest project bullets.",
  "Include target-company vocabulary for platform, security, or fintech roles.",
  "Move contact and portfolio links closer to the resume header.",
]

const recommendations = [
  "Create one resume variant for product engineering and one for AI workflow roles.",
  "Add a short impact line under each project with metrics, user count, or cycle-time savings.",
  "Mirror the exact title from each job description in the resume summary before applying.",
]

export function AiScoringWorkspace() {
  return (
    <section className="grid gap-6">
      <PageHeader
        badge="AI Scoring"
        description="Mock scoring keeps the page useful until live resume parsing and scoring APIs are connected."
        icon={Sparkles}
        title="AI Scoring"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {scoreCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{card.label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{card.detail}</p>
                </div>
                <span className="font-analytics text-3xl font-semibold text-white">
                  {card.value}
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-white/75"
                  style={{ width: `${card.value}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="size-4 text-muted-foreground" aria-hidden="true" />
              Resume intelligence
            </CardTitle>
            <CardDescription>
              Strengths and weaknesses are mocked from the profile signal model.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <SignalList
              icon={CheckCircle2}
              items={strengths}
              title="Strengths"
              variant="success"
            />
            <SignalList
              icon={TriangleAlert}
              items={weaknesses}
              title="Weaknesses"
              variant="warning"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" aria-hidden="true" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Next actions to improve ATS readiness and recruiter clarity.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={recommendation}
                className="rounded-lg border border-border bg-graphite p-4"
              >
                <Badge variant="outline">Step {index + 1}</Badge>
                <p className="mt-3 text-sm leading-6 text-foreground">{recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SignalList({
  icon: Icon,
  items,
  title,
  variant,
}: {
  icon: LucideIcon
  items: string[]
  title: string
  variant: "success" | "warning"
}) {
  return (
    <div className="rounded-lg border border-border bg-graphite p-4">
      <Badge variant={variant}>
        <Icon className="size-3" aria-hidden="true" />
        {title}
      </Badge>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-muted-foreground">
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}
