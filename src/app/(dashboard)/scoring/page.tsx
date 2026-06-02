import type { Metadata } from "next"

import { AiScoringWorkspace } from "@/components/scoring/ai-scoring-workspace"

export const metadata: Metadata = {
  title: "AI Scoring",
}

export default function ScoringPage() {
  return <AiScoringWorkspace />
}
