import type { Metadata } from "next"

import { OfferDetailWorkspace } from "@/components/offers/offer-detail-workspace"
import { getOfferByIdOrSlug, getOffersForProfile } from "@/features/offers/queries"
import { getCurrentWorkspaceProfile } from "@/features/profile/current"

export const metadata: Metadata = {
  title: "Offer Details",
}

export default async function OfferDetailsPage({
  params,
}: {
  params: Promise<{ offerId: string }>
}) {
  const { offerId } = await params
  const profile = await getCurrentWorkspaceProfile()
  const profileId = profile?.id
  const [offer, offers] = await Promise.all([
    getOfferByIdOrSlug(offerId, profileId),
    getOffersForProfile(profileId),
  ])
  const relatedOffers = offers.filter((item) => item.id !== offer?.id).slice(0, 3)

  return <OfferDetailWorkspace initialOffer={offer} relatedOffers={relatedOffers} />
}
