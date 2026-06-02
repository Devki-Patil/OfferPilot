import type { Metadata } from "next"

import { OfferDetailWorkspace } from "@/components/offers/offer-detail-workspace"
import { getMockOfferById } from "@/features/offers/data"

export const metadata: Metadata = {
  title: "Offer Details",
}

export default async function OfferDetailsPage({
  params,
}: {
  params: Promise<{ offerId: string }>
}) {
  const { offerId } = await params

  return <OfferDetailWorkspace fallbackOffer={getMockOfferById(offerId)} />
}
