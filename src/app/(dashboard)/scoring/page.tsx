import type { Metadata } from "next"

import { AiScoringWorkspace } from "@/components/scoring/ai-scoring-workspace"
import { getCurrentWorkspaceProfile } from "@/features/profile/current"
import { getLatestResumeScoreForProfile } from "@/features/scoring/queries"

export const metadata: Metadata = {
  title: "AI Scoring",
}

export default async function ScoringPage() {
  const profile = await getCurrentWorkspaceProfile()
  const summary = await getLatestResumeScoreForProfile(profile?.id)

  return <AiScoringWorkspace initialSummary={summary} />
}
