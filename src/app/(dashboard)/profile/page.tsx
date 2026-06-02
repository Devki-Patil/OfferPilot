import { auth, currentUser } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { ProfileWorkspace } from "@/components/profile/profile-workspace"
import {
  createDemoProfile,
  getOrCreateProfileResultByClerkId,
  normalizeProfile,
} from "@/features/profile/queries"
import { clerkPaths, isClerkConfigured } from "@/lib/clerk/config"
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin"

export const metadata: Metadata = {
  title: "Profile",
}

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  if (!isClerkConfigured()) {
    return (
      <ProfileWorkspace
        notice="Clerk is not configured, so this page is using local demo profile data."
        profile={createDemoProfile()}
      />
    )
  }

  const { userId } = await auth()

  if (!userId) {
    redirect(clerkPaths.signInUrl)
  }

  const clerkUser = await currentUser().catch(() => null)
  const primaryEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? null
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.fullName ||
    primaryEmail

  if (!isSupabaseAdminConfigured()) {
    return (
      <ProfileWorkspace
        notice="Supabase is not configured. Add the server credentials to load saved profile data."
        profile={createDemoProfile({ email: primaryEmail, fullName })}
      />
    )
  }

  const profileResult = await getOrCreateProfileResultByClerkId(userId, {
    email: primaryEmail,
    fullName,
  })

  if (profileResult.status === "error") {
    return (
      <ProfileWorkspace
        notice={`${profileResult.error} Demo profile data is active for now.`}
        profile={createDemoProfile({ email: primaryEmail, fullName })}
      />
    )
  }

  if (profileResult.status === "empty") {
    return (
      <ProfileWorkspace
        notice="No saved profile exists yet. Start with this local profile, or complete onboarding to save it."
        profile={createDemoProfile({ clerkUserId: userId, email: primaryEmail, fullName })}
      />
    )
  }

  return <ProfileWorkspace profile={normalizeProfile(profileResult.data)} />
}
