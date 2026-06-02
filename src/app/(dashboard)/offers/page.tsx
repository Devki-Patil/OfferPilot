import type { Metadata } from "next"

import { OffersWorkspace } from "@/components/offers/offers-workspace"

export const metadata: Metadata = {
  title: "Offers",
}

export default function OffersPage() {
  return <OffersWorkspace />
}
