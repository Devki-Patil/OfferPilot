"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { FileText, Save, Upload, UserRound } from "lucide-react"

import { PageHeader } from "@/components/dashboard/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Database } from "@/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type EditableProfile = {
  email: string
  fullName: string
  headline: string
  location: string
  targetRole: string
}

const storageKey = "offerpilot.profile.edits.v1"

export function ProfileWorkspace({
  notice,
  profile,
}: {
  notice?: string
  profile: Profile
}) {
  const [resume, setResume] = useState<{ name: string; size: number } | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditableProfile>({
    email: profile.email ?? "",
    fullName: profile.full_name,
    headline: profile.headline ?? "",
    location: profile.location ?? "",
    targetRole: profile.target_role,
  })

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)

    if (!saved) {
      return
    }

    try {
      setDraft((current) => ({ ...current, ...(JSON.parse(saved) as EditableProfile) }))
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  const skills = profile.skills.length ? profile.skills : ["React", "TypeScript", "AI workflows"]
  const resumeLabel = useMemo(() => {
    if (resume) {
      return `${resume.name} · ${Math.round(resume.size / 1024)} KB`
    }

    return profile.resume_path ?? "No resume uploaded yet"
  }, [profile.resume_path, resume])

  function saveProfile() {
    window.localStorage.setItem(storageKey, JSON.stringify(draft))
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  return (
    <section className="grid gap-6">
      <PageHeader
        action={
          <Button type="button" onClick={saveProfile}>
            <Save className="size-4" aria-hidden="true" />
            Save profile
          </Button>
        }
        badge="Profile"
        description="Manage the profile signal used for matching, scoring, recommendations, and interview prep."
        icon={UserRound}
        title={draft.fullName || "Profile"}
      />

      {notice && (
        <Card className="border-amber-400/16 bg-amber-400/8">
          <CardHeader>
            <Badge variant="warning">Fallback active</Badge>
            <CardDescription className="max-w-3xl text-foreground/82">{notice}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {savedAt && (
        <div className="rounded-lg border border-emerald-400/16 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-200">
          Profile edits saved locally at {savedAt}.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Editable information</CardTitle>
            <CardDescription>
              These fields are stored locally for now; onboarding remains the Supabase write path.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <Input
                  value={draft.fullName}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, fullName: event.target.value }))
                  }
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </Field>
              <Field label="Role">
                <Input
                  value={draft.targetRole}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, targetRole: event.target.value }))
                  }
                />
              </Field>
              <Field label="Location">
                <Input
                  value={draft.location}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, location: event.target.value }))
                  }
                />
              </Field>
            </div>
            <Field label="Headline">
              <Input
                value={draft.headline}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, headline: event.target.value }))
                }
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume upload</CardTitle>
            <CardDescription>Attach a resume for preview and future parsing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-graphite px-4 py-8 text-center transition-colors hover:bg-graphite-elevated">
              <Upload className="mb-3 size-5 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Upload resume</span>
              <span className="mt-1 text-xs text-muted-foreground">PDF, DOC, or DOCX</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]

                  if (file) {
                    setResume({ name: file.name, size: file.size })
                  }
                }}
              />
            </label>
            <div className="rounded-lg border border-border bg-graphite p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary">
                  <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Resume preview</p>
                  <p className="truncate text-xs text-muted-foreground">{resumeLabel}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <PreviewRow label="ATS readiness" value="86" />
                <PreviewRow label="Skills indexed" value={`${skills.length}`} />
                <PreviewRow label="Profile source" value={profile.resume_path ? "Supabase" : "Local"} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Signals available to matching, ATS scoring, and pipeline prep.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </CardContent>
      </Card>
    </section>
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

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
