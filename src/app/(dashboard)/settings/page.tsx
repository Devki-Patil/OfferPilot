import { Settings } from "lucide-react"
import type { Metadata } from "next"

import { DashboardSectionPage } from "@/components/dashboard/section-page"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProfileStoreHealth } from "@/features/profile/diagnostics"

export const metadata: Metadata = {
  title: "Settings",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const profileStore = await getProfileStoreHealth()
  const profileStoreBadge =
    profileStore.status === "ready"
      ? "Ready"
      : profileStore.status === "schema-missing"
        ? "Create table"
        : profileStore.status === "not-configured"
          ? "Env"
          : "Fallback"

  return (
    <section className="grid gap-6">
      <DashboardSectionPage
        badge="Settings"
        description="Check integration readiness and workspace defaults without loading heavy client-side settings panels."
        icon={Settings}
        metrics={[
          {
            label: "Profile store",
            value: profileStore.status === "ready" ? "Online" : "Demo",
          },
          {
            label: "Saved profiles",
            value:
              profileStore.profileCount === null
                ? "Fallback"
                : `${profileStore.profileCount}`,
          },
          { label: "Defaults", value: "9" },
        ]}
        items={[
          {
            label: "Supabase profile store",
            description: profileStore.description,
            status: profileStoreBadge,
          },
          {
            label: "Resume bucket",
            description: "Apply supabase/storage.sql when upload storage is needed.",
            status: "Optional",
          },
          {
            label: "Demo fallback",
            description: "Dashboard routes stay usable while integrations recover.",
            status: "Enabled",
          },
        ]}
        title="Settings"
      />

      <Card className="bg-card/90">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Supabase profile health</CardTitle>
              <CardDescription>{profileStore.title}</CardDescription>
            </div>
            <Badge
              variant={profileStore.status === "ready" ? "success" : "warning"}
            >
              {profileStoreBadge}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
          <HealthRow label="URL" value={profileStore.config.url} />
          <HealthRow
            label="Service role"
            value={profileStore.config.serviceRoleKey}
          />
          <HealthRow label="Anon key" value={profileStore.config.anonKey} />
        </CardContent>
      </Card>
    </section>
  )
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-graphite px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium capitalize text-foreground">{value}</p>
    </div>
  )
}
