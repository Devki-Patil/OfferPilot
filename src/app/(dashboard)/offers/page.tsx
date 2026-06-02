import type { Metadata } from "next"

import { OffersWorkspace } from "@/components/offers/offers-workspace"
import { getOffersForProfile } from "@/features/offers/queries"
import { getCurrentWorkspaceProfile } from "@/features/profile/current"

export const metadata: Metadata = {
  title: "Offers",
}

export default async function OffersPage() {
  const profile = await getCurrentWorkspaceProfile()
  const offers = await getOffersForProfile(profile?.id)

  return <OffersWorkspace initialOffers={offers} />
}
