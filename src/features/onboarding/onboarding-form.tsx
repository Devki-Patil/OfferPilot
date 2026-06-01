"use client"

import { useActionState } from "react"
import { ArrowRight, Link, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { saveOnboardingProfile } from "./actions"
import type { OnboardingState } from "./schema"

const initialState: OnboardingState = {
  status: "idle",
}

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(saveOnboardingProfile, initialState)

  return (
    <form action={formAction} className="grid gap-6">
      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resume upload</CardTitle>
          <CardDescription>
            Upload the resume you want OfferPilot AI to use as the source profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-graphite px-4 py-8 text-center transition-colors hover:bg-graphite-elevated">
            <Upload className="mb-3 size-5 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Upload resume</span>
            <span className="mt-1 text-xs text-muted-foreground">PDF, DOC, or DOCX</span>
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual profile</CardTitle>
          <CardDescription>
            Add the structured details that power matching, interviews, and offer strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" name="fullName" error={state.fieldErrors?.fullName?.[0]} required />
            <Field label="Target role" name="targetRole" error={state.fieldErrors?.targetRole?.[0]} required />
            <Field label="Salary expectation" name="salaryExpectation" placeholder="$140k - $170k" />
            <Field label="Location" name="location" placeholder="Remote, New York, London" />
          </div>

          <Field
            label="Headline"
            name="headline"
            placeholder="Senior product designer focused on AI workflows"
          />

          <Field
            label="Skills"
            name="skills"
            placeholder="React, TypeScript, Product Strategy, ATS Optimization"
            error={state.fieldErrors?.skills?.[0]}
            required
          />

          <TextareaField
            label="Experience"
            name="experience"
            placeholder={"Lead Product Designer at Northstar Labs\nSenior UX Designer at AlloyWorks"}
          />

          <TextareaField
            label="Projects"
            name="projects"
            placeholder={"AI resume parser\nInterview readiness dashboard\nOffer analytics workspace"}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="GitHub"
              name="githubUrl"
              icon
              placeholder="https://github.com/username"
              error={state.fieldErrors?.githubUrl?.[0]}
            />
            <Field
              label="LinkedIn"
              name="linkedinUrl"
              icon
              placeholder="https://linkedin.com/in/username"
              error={state.fieldErrors?.linkedinUrl?.[0]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving profile" : "Complete onboarding"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  placeholder,
  error,
  required,
  icon,
}: {
  label: string
  name: string
  placeholder?: string
  error?: string
  required?: boolean
  icon?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </span>
      <span className="relative">
        {icon && (
          <Link className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          name={name}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={icon ? "pl-9" : undefined}
        />
      </span>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}

function TextareaField({
  label,
  name,
  placeholder,
}: {
  label: string
  name: string
  placeholder?: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={5}
        className="min-h-28 w-full resize-y rounded-md border border-input bg-graphite px-3 py-2 text-sm text-foreground shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
      />
    </label>
  )
}
