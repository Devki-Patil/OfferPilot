import { z } from "zod"

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null)
  .pipe(z.string().url().nullable())

export const onboardingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  headline: z.string().trim().max(140).optional(),
  skills: z.string().trim().min(2, "Add at least one skill."),
  experience: z.string().trim().optional(),
  projects: z.string().trim().optional(),
  targetRole: z.string().trim().min(2, "Enter a target role."),
  salaryExpectation: z.string().trim().optional(),
  location: z.string().trim().optional(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
})

export type OnboardingState = {
  status: "idle" | "error"
  message?: string
  fieldErrors?: Partial<Record<keyof z.input<typeof onboardingSchema>, string[]>>
}

export function splitLines(value?: string) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function splitSkills(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}
