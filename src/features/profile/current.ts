import "server-only"

import { auth, currentUser } from "@clerk/nextjs/server"

import { isClerkConfigured } from "@/lib/clerk/config"
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin"

import { getOrCreateProfileResultByClerkId } from "./queries"

export async function getCurrentWorkspaceProfile() {
  if (!isClerkConfigured() || !isSupabaseAdminConfigured()) {
    return null
  }

  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const clerkUser = await currentUser().catch((error) => {
    console.error("Failed to load Clerk user details for workspace data.", error)
    return null
  })
  const primaryEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? null
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.fullName ||
    primaryEmail

  const profileResult = await getOrCreateProfileResultByClerkId(userId, {
    email: primaryEmail,
    fullName,
  })

  return profileResult.status === "ready" ? profileResult.data : null
}
