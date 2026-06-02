import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/types/database"
import {
  formatErrorForLog,
  formatPostgrestErrorForLog,
  getPostgrestFailureReason,
  getProfileErrorMessage,
  getUnknownFailureReason,
  type ProfileFailureReason,
} from "./errors"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]

type ProfileSeed = {
  clerkUserId?: string | null
  email?: string | null
  fullName?: string | null
}

export type ProfileQueryResult =
  | { data: Profile; error: null; status: "ready" }
  | { data: null; error: null; status: "empty" }
  | {
      data: null
      error: string
      reason: ProfileFailureReason
      status: "error"
    }

const profileLookupTimeoutMs = 15000
const profileWriteTimeoutMs = 15000

export function createDemoProfile(seed: ProfileSeed = {}): Profile {
  const now = new Date().toISOString()

  return {
    id: "demo-profile",
    clerk_user_id: seed.clerkUserId?.trim() || "demo-user",
    full_name: seed.fullName?.trim() || "Demo Operator",
    email: seed.email ?? "demo@offerpilot.ai",
    headline: "AI-assisted offer pipeline",
    target_role: "Product Engineer",
    salary_expectation: "$160,000",
    location: "Remote",
    skills: ["React", "TypeScript", "AI workflows", "Product Strategy"],
    experience: [
      "Built premium dashboard workflows for high-signal teams.",
      "Shipped automation surfaces with review-first controls.",
    ],
    projects: [
      "Offer intelligence command center",
      "ATS resume scoring and job matching engine",
    ],
    links: {
      github: "https://github.com/offerpilot",
      linkedin: "https://linkedin.com/company/offerpilot-ai",
    },
    resume_path: null,
    onboarding_completed_at: now,
    created_at: now,
    updated_at: now,
  }
}

export function normalizeProfile(
  profile: Partial<Profile> | null | undefined,
  seed: ProfileSeed = {},
): Profile {
  const fallback = createDemoProfile(seed)

  if (!profile) {
    return fallback
  }

  return {
    ...fallback,
    ...profile,
    clerk_user_id:
      profile.clerk_user_id?.trim() || seed.clerkUserId?.trim() || fallback.clerk_user_id,
    full_name: profile.full_name?.trim() || fallback.full_name,
    email: profile.email ?? seed.email ?? fallback.email,
    headline: profile.headline?.trim() || fallback.headline,
    target_role:
      profile.target_role?.trim() && profile.target_role !== "Not set"
        ? profile.target_role
        : fallback.target_role,
    salary_expectation: profile.salary_expectation?.trim() || fallback.salary_expectation,
    location: profile.location?.trim() || fallback.location,
    skills: normalizeTextList(profile.skills, fallback.skills),
    experience: normalizeJsonList(profile.experience, fallback.experience),
    projects: normalizeJsonList(profile.projects, fallback.projects),
    links: normalizeJsonRecord(profile.links, fallback.links),
    resume_path: profile.resume_path ?? fallback.resume_path,
    onboarding_completed_at:
      profile.onboarding_completed_at === undefined
        ? fallback.onboarding_completed_at
        : profile.onboarding_completed_at,
    created_at: profile.created_at ?? fallback.created_at,
    updated_at: profile.updated_at ?? fallback.updated_at,
  }
}

export async function getProfileByClerkId(clerkUserId: string) {
  const result = await getProfileResultByClerkId(clerkUserId)

  return result.data
}

export async function getProfileResultByClerkId(
  clerkUserId: string,
): Promise<ProfileQueryResult> {
  return loadProfileByClerkId(clerkUserId)
}

export async function getOrCreateProfileResultByClerkId(
  clerkUserId: string,
  seed: ProfileSeed = {},
): Promise<ProfileQueryResult> {
  const existingProfile = await loadProfileByClerkId(clerkUserId)

  if (existingProfile.status !== "empty") {
    return existingProfile
  }

  return createProfileForClerkUser(clerkUserId, seed)
}

async function loadProfileByClerkId(
  clerkUserId: string,
): Promise<ProfileQueryResult> {
  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return {
      data: null,
      error:
        "Supabase server credentials are not configured. Profile data is unavailable.",
      reason: "not-configured",
      status: "error",
    }
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle(),
      profileLookupTimeoutMs,
      "Supabase profile lookup timed out.",
    )

    if (error) {
      const reason = getPostgrestFailureReason(error)
      const details = formatPostgrestErrorForLog(error)

      console.error("Failed to load profile from Supabase.", {
        clerkUserId,
        details,
        reason,
      })
      return {
        data: null,
        error: getProfileErrorMessage(reason, details),
        reason,
        status: "error",
      }
    }

    if (!data) {
      console.info("No profile row found for Clerk user. Creating profile.", {
        clerkUserId,
      })
      return {
        data: null,
        error: null,
        status: "empty",
      }
    }

    return {
      data: normalizeProfile(data, { clerkUserId }),
      error: null,
      status: "ready",
    }
  } catch (error) {
    const details = formatErrorForLog(error)
    const reason = getUnknownFailureReason(error)

    console.error("Failed to load profile from Supabase.", {
      clerkUserId,
      details,
      reason,
    })
    return {
      data: null,
      error: getProfileErrorMessage(reason, details),
      reason,
      status: "error",
    }
  }
}

async function createProfileForClerkUser(
  clerkUserId: string,
  seed: ProfileSeed,
): Promise<ProfileQueryResult> {
  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return {
      data: null,
      error:
        "Supabase server credentials are not configured. Profile data is unavailable.",
      reason: "not-configured",
      status: "error",
    }
  }

  const fallbackName = seed.email?.split("@")[0] || "New user"
  const profile: ProfileInsert = {
    clerk_user_id: clerkUserId,
    email: seed.email ?? null,
    full_name: seed.fullName?.trim() || fallbackName,
    target_role: "Not set",
    skills: [],
    experience: [],
    projects: [],
    links: {},
  }

  try {
    const { data, error } = await withTimeout(
      supabase.from("profiles").insert(profile).select("*").single(),
      profileWriteTimeoutMs,
      "Supabase profile creation timed out.",
    )

    if (error) {
      if (error.code === "23505") {
        return loadProfileByClerkId(clerkUserId)
      }

      const reason = getPostgrestFailureReason(error)
      const details = formatPostgrestErrorForLog(error)

      console.error("Failed to create profile in Supabase.", {
        clerkUserId,
        details,
        reason,
      })
      return {
        data: null,
        error: getProfileErrorMessage(reason, details),
        reason,
        status: "error",
      }
    }

    console.info("Created Supabase profile for Clerk user.", {
      clerkUserId,
      profileId: data.id,
    })

    return {
      data: normalizeProfile(data, { clerkUserId, ...seed }),
      error: null,
      status: "ready",
    }
  } catch (error) {
    const details = formatErrorForLog(error)
    const reason = getUnknownFailureReason(error)

    console.error("Failed to create profile in Supabase.", {
      clerkUserId,
      details,
      reason,
    })
    return {
      data: null,
      error: getProfileErrorMessage(reason, details),
      reason,
      status: "error",
    }
  }
}

function normalizeTextList(
  value: Profile["skills"] | null | undefined,
  fallback: string[],
) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)

  return items.length ? items : fallback
}

function normalizeJsonList(
  value: Profile["experience"] | undefined,
  fallback: Profile["experience"],
) {
  return Array.isArray(value) ? value : fallback
}

function normalizeJsonRecord(
  value: Profile["links"] | undefined,
  fallback: Profile["links"],
) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : fallback
}

function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), timeoutMs)
  })

  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => {
    clearTimeout(timeout)
  })
}
