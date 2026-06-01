import { Sparkles } from "lucide-react"
import type { Metadata } from "next"

import { DashboardSectionPage } from "@/components/dashboard/section-page"

export const metadata: Metadata = {
  title: "AI Scoring",
}

export default function ScoringPage() {
  return (
    <DashboardSectionPage
      badge="AI Scoring"
      description="Review ATS readiness, role alignment, and recruiter signal quality in a calm scoring surface."
      icon={Sparkles}
      metrics={[
        { label: "ATS readiness", value: "86" },
        { label: "Role alignment", value: "91" },
        { label: "Signal clarity", value: "78" },
      ]}
      items={[
        {
          label: "Keyword coverage",
          description: "Core React, TypeScript, and product workflow terms are represented.",
          status: "Strong",
        },
        {
          label: "Project evidence",
          description: "Add one more measurable project outcome to sharpen ranking context.",
          status: "Improve",
        },
        {
          label: "Recruiter context",
          description: "Contact and compensation fields are ready for reviewed outreach.",
          status: "Ready",
        },
      ]}
      title="AI Scoring"
    />
  )
}
