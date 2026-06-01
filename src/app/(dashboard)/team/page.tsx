import { UsersRound } from "lucide-react"
import type { Metadata } from "next"

import { DashboardSectionPage } from "@/components/dashboard/section-page"

export const metadata: Metadata = {
  title: "Team",
}

export default function TeamPage() {
  return (
    <DashboardSectionPage
      badge="Team"
      description="Coordinate review ownership, approval states, and shared offer intelligence."
      icon={UsersRound}
      metrics={[
        { label: "Reviewers", value: "3" },
        { label: "Approvals", value: "6" },
        { label: "Open notes", value: "4" },
      ]}
      items={[
        {
          label: "Resume reviewer",
          description: "Owns final resume signal quality before high-intent applications.",
          status: "Assigned",
        },
        {
          label: "Interview coach",
          description: "Keeps mock interview prompts aligned with the target role.",
          status: "Ready",
        },
        {
          label: "Offer approver",
          description: "Reviews compensation notes and decision tradeoffs.",
          status: "Pending",
        },
      ]}
      title="Team"
    />
  )
}
