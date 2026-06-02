import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/types/database"

import { getAggregatedJobSources } from "./mock-sources"
import type { AggregatedJob, JobSource } from "./types"

type SavedJobRow = Database["public"]["Tables"]["saved_jobs"]["Row"]

const savedJobsLookupTimeoutMs = 15000
const jobSources = ["greenhouse", "lever", "ashby", "workday", "manual"] as const
const employmentTypes = ["full-time", "contract", "part-time", "internship"] as const
const seniorityLevels = ["junior", "mid", "senior", "lead", "executive"] as const

export async function getAggregatedJobSourcesForProfile({
  profileId,
  targetRole,
}: {
  profileId?: string | null
  targetRole: string
}): Promise<AggregatedJob[]> {
  if (!profileId) {
    return getAggregatedJobSources(targetRole)
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return getAggregatedJobSources(targetRole)
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("saved_jobs")
        .select("*")
        .eq("profile_id", profileId)
        .order("posted_at", { ascending: false }),
      savedJobsLookupTimeoutMs,
      "Supabase saved jobs lookup timed out.",
    )

    if (error) {
      console.error("Failed to load saved jobs from Supabase.", {
        details: error.message,
        profileId,
      })
      return getAggregatedJobSources(targetRole)
    }

    return data.map(mapSavedJobRow)
  } catch (error) {
    console.error("Failed to load saved jobs from Supabase.", { error, profileId })
    return getAggregatedJobSources(targetRole)
  }
}

function mapSavedJobRow(row: SavedJobRow): AggregatedJob {
  return {
    id: row.external_id || row.id,
    source: toJobSource(row.source),
    sourceUrl: row.source_url,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    salaryMin: row.salary_min ?? undefined,
    salaryMax: row.salary_max ?? undefined,
    currency: row.currency ?? undefined,
    recruiterName: row.recruiter_name ?? undefined,
    recruiterEmail: row.recruiter_email ?? undefined,
    employmentType: toEmploymentType(row.employment_type),
    seniority: toSeniority(row.seniority),
    skills: row.skills,
    postedAt: row.posted_at,
    expiresAt: row.expires_at ?? undefined,
    applicantCount: row.applicant_count ?? undefined,
    isRemote: row.is_remote,
  }
}

function toJobSource(value: string): JobSource {
  return jobSources.includes(value as JobSource) ? (value as JobSource) : "manual"
}

function toEmploymentType(value: string): AggregatedJob["employmentType"] {
  return employmentTypes.includes(value as AggregatedJob["employmentType"])
    ? (value as AggregatedJob["employmentType"])
    : "full-time"
}

function toSeniority(value: string | null): AggregatedJob["seniority"] {
  return seniorityLevels.includes(value as NonNullable<AggregatedJob["seniority"]>)
    ? (value as AggregatedJob["seniority"])
    : undefined
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
