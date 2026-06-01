import { BarChart3 } from "lucide-react"
import type { Metadata } from "next"

import { DashboardSectionPage } from "@/components/dashboard/section-page"

export const metadata: Metadata = {
  title: "Pipeline",
}

export default function PipelinePage() {
  return (
    <DashboardSectionPage
      badge="Pipeline"
      description="Keep application stages visible with lightweight server-rendered pipeline data."
      icon={BarChart3}
      metrics={[
        { label: "Saved", value: "8" },
        { label: "Applied", value: "5" },
        { label: "Interviewing", value: "2" },
      ]}
      items={[
        {
          label: "Resume review",
          description: "Two roles are waiting for final resume alignment before apply.",
          status: "Next",
        },
        {
          label: "Recruiter screen",
          description: "Mock loop and compensation notes are attached to the Stripe stage.",
          status: "Prep",
        },
        {
          label: "Offer decision",
          description: "Decision notes stay available even when live sources are offline.",
          status: "Open",
        },
      ]}
      title="Pipeline"
    />
  )
}
