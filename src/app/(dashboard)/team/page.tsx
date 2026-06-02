import type { Metadata } from "next"

import { TeamWorkspace } from "@/components/team/team-workspace"

export const metadata: Metadata = {
  title: "Team",
}

export default function TeamPage() {
  return <TeamWorkspace />
}
