"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Bell, KeyRound, LockKeyhole, Palette, Settings, Trash2, UserCog } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ProfileStoreHealth } from "@/features/profile/diagnostics"

export function SettingsWorkspace({ profileStore }: { profileStore: ProfileStoreHealth }) {
  const [notifications, setNotifications] = useState({
    interviews: true,
    offers: true,
    weekly: false,
  })
  const [theme, setTheme] = useState("Dark")

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
      <PageHeader
        badge="Settings"
        description="Manage account preferences, workspace defaults, integration readiness, and security controls."
        icon={Settings}
        title="Settings"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-6">
          <SettingsCard
            description="Basic account defaults used across the workspace."
            icon={UserCog}
            title="Account settings"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Workspace name">
                <Input defaultValue="OfferPilot AI Workspace" />
              </Field>
              <Field label="Default owner">
                <Input defaultValue="Devki" />
              </Field>
            </div>
          </SettingsCard>

          <SettingsCard
            description="Choose which application events should notify you."
            icon={Bell}
            title="Notification settings"
          >
            <Toggle
              checked={notifications.interviews}
              label="Interview reminders"
              onChange={() =>
                setNotifications((current) => ({
                  ...current,
                  interviews: !current.interviews,
                }))
              }
            />
            <Toggle
              checked={notifications.offers}
              label="Offer decision alerts"
              onChange={() =>
                setNotifications((current) => ({ ...current, offers: !current.offers }))
              }
            />
            <Toggle
              checked={notifications.weekly}
              label="Weekly pipeline digest"
              onChange={() =>
                setNotifications((current) => ({ ...current, weekly: !current.weekly }))
              }
            />
          </SettingsCard>

          <SettingsCard
            description="The product currently ships with a polished dark theme."
            icon={Palette}
            title="Theme settings"
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {["Dark", "System", "High contrast"].map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={theme === item ? "default" : "outline"}
                  onClick={() => setTheme(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </SettingsCard>
        </div>

        <div className="grid gap-6 content-start">
          <SettingsCard
            description="Authentication is handled by Clerk when configured."
            icon={LockKeyhole}
            title="Security"
          >
            <div className="grid gap-3">
              <SecurityRow label="Session protection" value="Clerk middleware" />
              <SecurityRow label="Protected dashboard" value="Enabled when Clerk is configured" />
              <SecurityRow label="Profile creation" value="Automatic first login seed" />
            </div>
          </SettingsCard>

          <SettingsCard
            description="Future integrations can expose scoped API keys here."
            icon={KeyRound}
            title="API keys"
          >
            <div className="rounded-lg border border-dashed border-border bg-graphite p-4">
              <Badge variant="outline">Placeholder</Badge>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                API key creation, rotation, and last-used timestamps are reserved for the backend
                integrations phase.
              </p>
            </div>
          </SettingsCard>

          <SettingsCard
            description="This is intentionally a non-destructive UI placeholder."
            icon={Trash2}
            title="Delete account"
          >
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Account deletion needs a server action that clears Clerk, Supabase profile data,
                resumes, offers, and team membership.
              </p>
              <Button className="mt-4" type="button" variant="destructive">
                Request deletion
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Supabase profile health</CardTitle>
              <CardDescription>{profileStore.title}</CardDescription>
            </div>
            <Badge variant={profileStore.status === "ready" ? "success" : "warning"}>
              {profileStoreBadge}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
          <SecurityRow label="URL" value={profileStore.config.url} />
          <SecurityRow label="Service role" value={profileStore.config.serviceRoleKey} />
          <SecurityRow label="Anon key" value={profileStore.config.anonKey} />
        </CardContent>
      </Card>
    </section>
  )
}

function SettingsCard({
  children,
  description,
  icon: Icon,
  title,
}: {
  children: ReactNode
  description: string
  icon: LucideIcon
  title: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  )
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-graphite px-4 py-3 text-left text-sm transition-colors hover:bg-graphite-elevated"
    >
      <span className="font-medium text-foreground">{label}</span>
      <span
        className={`flex h-6 w-11 items-center rounded-full border border-border p-0.5 transition-colors ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  )
}

function SecurityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-graphite px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  )
}
