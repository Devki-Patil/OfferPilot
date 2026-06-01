"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { onboardingSchema, splitLines, splitSkills, type OnboardingState } from "./schema"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/types/database"

const resumeBucket = process.env.SUPABASE_RESUME_BUCKET ?? "resumes"

export async function saveOnboardingProfile(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const { userId } = await auth()

  if (!userId) {
    return {
      status: "error",
      message: "You must be signed in to complete onboarding.",
    }
  }

  const parsed = onboardingSchema.safeParse({
    fullName: formData.get("fullName"),
    headline: formData.get("headline"),
    skills: formData.get("skills"),
    experience: formData.get("experience"),
    projects: formData.get("projects"),
    targetRole: formData.get("targetRole"),
    salaryExpectation: formData.get("salaryExpectation"),
    location: formData.get("location"),
    githubUrl: formData.get("githubUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return {
      status: "error",
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local.",
    }
  }

  const clerkUser = await currentUser()
  const resume = formData.get("resume")
  let resumePath: string | null = null

  if (resume instanceof File && resume.size > 0) {
    const extension = resume.name.split(".").pop()?.toLowerCase() ?? "pdf"
    const safeName = `${Date.now()}.${extension.replace(/[^a-z0-9]/g, "")}`
    resumePath = `${userId}/${safeName}`

    const { error } = await supabase.storage
      .from(resumeBucket)
      .upload(resumePath, resume, {
        contentType: resume.type || "application/octet-stream",
        upsert: true,
      })

    if (error) {
      return {
        status: "error",
        message: `Resume upload failed: ${error.message}`,
      }
    }
  }

  const values = parsed.data
  const profileValues: Database["public"]["Tables"]["profiles"]["Insert"] = {
    clerk_user_id: userId,
    full_name: values.fullName,
    email: clerkUser?.emailAddresses[0]?.emailAddress ?? null,
    headline: values.headline || null,
    target_role: values.targetRole,
    salary_expectation: values.salaryExpectation || null,
    location: values.location || null,
    skills: splitSkills(values.skills),
    experience: splitLines(values.experience),
    projects: splitLines(values.projects),
    links: {
      github: values.githubUrl,
      linkedin: values.linkedinUrl,
    },
    resume_path: resumePath,
    onboarding_completed_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(profileValues, { onConflict: "clerk_user_id" })

  if (error) {
    return {
      status: "error",
      message: `Profile could not be saved: ${error.message}`,
    }
  }

  redirect("/dashboard")
}
