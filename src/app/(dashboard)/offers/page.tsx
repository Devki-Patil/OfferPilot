import { BriefcaseBusiness } from "lucide-react"
import type { Metadata } from "next"

import { DashboardSectionPage } from "@/components/dashboard/section-page"

export const metadata: Metadata = {
  title: "Offers",
}

export default function OffersPage() {
  return (
    <DashboardSectionPage
      badge="Offers"
      description="Track recommended roles, saved opportunities, and offer-stage motion without waiting on external data."
      icon={BriefcaseBusiness}
      metrics={[
        { label: "Active offers", value: "4" },
        { label: "Review queue", value: "2" },
        { label: "Draft replies", value: "3" },
      ]}
      items={[
        {
          label: "Vanta",
          description: "Product Engineer recommendation with strong workflow and TypeScript fit.",
          status: "Recommended",
        },
        {
          label: "Linear",
          description: "Lead role queued for resume tailoring and interview prep.",
          status: "Queued",
        },
        {
          label: "Stripe",
          description: "Compensation band ready for follow-up and recruiter confirmation.",
          status: "Review",
        },
      ]}
      title="Offers"
    />
  )
}
