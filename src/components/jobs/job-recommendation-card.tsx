import { Building2, Clock3, DollarSign, ShieldCheck, UserRoundCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { RecommendedJob } from "@/features/jobs/types"

export function JobRecommendationCard({ job }: { job: RecommendedJob }) {
  return (
    <article className="rounded-lg border border-border bg-graphite p-4 hover:bg-graphite-elevated">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">{job.title}</h2>
            {job.duplicateCount > 0 && (
              <Badge variant="outline">{job.duplicateCount} duplicate merged</Badge>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Building2 className="size-3.5" aria-hidden="true" />
            {job.company}
            <span aria-hidden="true">/</span>
            {job.location}
            <span aria-hidden="true">/</span>
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </p>
        </div>
        <div className="font-analytics text-left sm:text-right">
          <p className="text-2xl font-semibold text-white">{job.score.fit}%</p>
          <p className="text-xs text-muted-foreground">fit score</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <ScorePill
          icon={DollarSign}
          label="Salary"
          value={job.score.salaryConfidence}
        />
        <ScorePill
          icon={UserRoundCheck}
          label="Recruiter"
          value={job.score.recruiterPresence}
        />
        <ScorePill icon={Clock3} label="Urgency" value={job.score.urgency} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.score.reasons.slice(0, 3).map((reason) => (
          <Badge key={reason} variant="outline">
            <ShieldCheck className="size-3" aria-hidden="true" />
            {reason}
          </Badge>
        ))}
      </div>
    </article>
  )
}

function ScorePill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign
  label: string
  value: number
}) {
  return (
    <div className="rounded-md border border-border bg-white/[0.035] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className="font-analytics text-sm font-semibold text-foreground">
          {value}
        </span>
      </div>
    </div>
  )
}

function formatSalary(min?: number, max?: number, currency = "USD") {
  if (!min && !max) {
    return "Salary unlisted"
  }

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    style: "currency",
    currency,
  })

  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  return formatter.format(min ?? max ?? 0)
}
