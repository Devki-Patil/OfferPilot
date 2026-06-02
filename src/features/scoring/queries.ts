import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/types/database"

type ResumeScoreRow = Database["public"]["Tables"]["resume_scores"]["Row"]

export type ResumeScoreSummary = {
  scoreCards: {
    label: string
    value: number
    detail: string
  }[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

const resumeScoreLookupTimeoutMs = 15000

export const fallbackResumeScoreSummary: ResumeScoreSummary = {
  scoreCards: [
    {
      label: "Resume score",
      value: 88,
      detail: "Clear seniority and measurable product engineering impact.",
    },
    {
      label: "Skills match",
      value: 91,
      detail: "React, TypeScript, AI workflows, and product strategy overlap strongly.",
    },
    {
      label: "ATS score",
      value: 84,
      detail: "Keyword coverage is solid with a few missing domain phrases.",
    },
  ],
  strengths: [
    "Strong product-engineering positioning with clear AI workflow evidence.",
    "Technical keywords are present in the highest-value resume sections.",
    "Projects show ownership across discovery, implementation, and rollout.",
  ],
  weaknesses: [
    "Add more quantified outcomes to the two newest project bullets.",
    "Include target-company vocabulary for platform, security, or fintech roles.",
    "Move contact and portfolio links closer to the resume header.",
  ],
  recommendations: [
    "Create one resume variant for product engineering and one for AI workflow roles.",
    "Add a short impact line under each project with metrics, user count, or cycle-time savings.",
    "Mirror the exact title from each job description in the resume summary before applying.",
  ],
}

export async function getLatestResumeScoreForProfile(
  profileId?: string | null,
): Promise<ResumeScoreSummary> {
  if (!profileId) {
    return fallbackResumeScoreSummary
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return fallbackResumeScoreSummary
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("resume_scores")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      resumeScoreLookupTimeoutMs,
      "Supabase resume score lookup timed out.",
    )

    if (error) {
      console.error("Failed to load resume score from Supabase.", {
        details: error.message,
        profileId,
      })
      return fallbackResumeScoreSummary
    }

    return data ? mapResumeScoreRow(data) : emptyResumeScoreSummary()
  } catch (error) {
    console.error("Failed to load resume score from Supabase.", { error, profileId })
    return fallbackResumeScoreSummary
  }
}

function mapResumeScoreRow(row: ResumeScoreRow): ResumeScoreSummary {
  return {
    scoreCards: [
      {
        label: "Resume score",
        value: clampScore(row.resume_score),
        detail: "Latest resume score from Supabase.",
      },
      {
        label: "Skills match",
        value: clampScore(row.skills_match),
        detail: "Skill overlap from the latest scoring run.",
      },
      {
        label: "ATS score",
        value: clampScore(row.ats_score),
        detail: "Applicant tracking readiness from the latest scoring run.",
      },
    ],
    strengths: row.strengths,
    weaknesses: row.weaknesses,
    recommendations: row.recommendations,
  }
}

function emptyResumeScoreSummary(): ResumeScoreSummary {
  return {
    scoreCards: [
      { label: "Resume score", value: 0, detail: "No Supabase score has been generated yet." },
      { label: "Skills match", value: 0, detail: "Run scoring to calculate skill overlap." },
      { label: "ATS score", value: 0, detail: "Run scoring to calculate ATS readiness." },
    ],
    strengths: [],
    weaknesses: [],
    recommendations: [],
  }
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
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
