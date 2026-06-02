import type { Metadata } from "next"

import { SettingsWorkspace } from "@/components/settings/settings-workspace"
import { getProfileStoreHealth } from "@/features/profile/diagnostics"

export const metadata: Metadata = {
  title: "Settings",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const profileStore = await getProfileStoreHealth()

  return <SettingsWorkspace profileStore={profileStore} />
}
