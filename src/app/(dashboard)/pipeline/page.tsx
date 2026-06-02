import type { Metadata } from "next"

import { PipelineBoard } from "@/components/pipeline/pipeline-board"
import { getPipelineCardsForProfile } from "@/features/offers/queries"
import { getCurrentWorkspaceProfile } from "@/features/profile/current"

export const metadata: Metadata = {
  title: "Pipeline",
}

export default async function PipelinePage() {
  const profile = await getCurrentWorkspaceProfile()
  const cards = await getPipelineCardsForProfile(profile?.id)

  return <PipelineBoard initialCards={cards} />
}
