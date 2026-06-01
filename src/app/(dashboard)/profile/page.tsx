import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createDemoProfile,
  getProfileResultByClerkId,
  normalizeProfile,
} from "@/features/profile/queries"
import { isClerkConfigured } from "@/lib/clerk/config"
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin"

export default async function ProfilePage() {
  if (!isClerkConfigured()) {
    return (
      <ProfileContent
        mode="Demo profile"
        notice="Clerk is not configured, so this page is using local demo profile data."
        profile={createDemoProfile()}
      />
    )
  }

  const { userId } = await auth()

  if (!userId) {
    return (
      <ProfileContent
        mode="Demo profile"
        notice="Sign in to load saved profile data. Demo data is active for this route."
        profile={createDemoProfile()}
      />
    )
  }

  if (!isSupabaseAdminConfigured()) {
    return (
      <ProfileContent
        mode="Demo profile"
        notice="Supabase is not configured. Add the server credentials to load saved profile data."
        profile={createDemoProfile()}
      />
    )
  }

  const profileResult = await getProfileResultByClerkId(userId)

  if (profileResult.status === "empty") {
    redirect("/onboarding")
  }

  if (profileResult.status === "error") {
    return (
      <ProfileContent
        mode="Demo profile"
        notice={`${profileResult.error} Demo profile data is active for now.`}
        profile={createDemoProfile()}
      />
    )
  }

  if (!profileResult.data.onboarding_completed_at) {
    redirect("/onboarding")
  }

  return <ProfileContent mode="Profile" profile={profileResult.data} />
}

function ProfileContent({
  mode,
  notice,
  profile,
}: {
  mode: string
  notice?: string
  profile: ReturnType<typeof createDemoProfile>
}) {
  const safeProfile = normalizeProfile(profile)
  const links = safeProfile.links as { github?: string | null; linkedin?: string | null } | null

  return (
    <section className="grid gap-6">
      <div>
        <Badge variant="outline">{mode}</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-white">{safeProfile.full_name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {safeProfile.headline ?? safeProfile.target_role}
        </p>
      </div>

      {notice && (
        <Card className="border-amber-400/16 bg-amber-400/8">
          <CardHeader>
            <Badge variant="warning">Fallback active</Badge>
            <CardDescription className="max-w-3xl text-foreground/82">
              {notice}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Career target</CardTitle>
            <CardDescription>Core details used by matching and offer intelligence.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <ProfileRow label="Target role" value={safeProfile.target_role} />
            <ProfileRow label="Salary expectation" value={safeProfile.salary_expectation} />
            <ProfileRow label="Location" value={safeProfile.location} />
            <ProfileRow label="GitHub" value={links?.github} />
            <ProfileRow label="LinkedIn" value={links?.linkedin} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Signals available to ATS scoring and interview prep.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {safeProfile.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function ProfileRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-1 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "Not provided"}</span>
    </div>
  )
}
