import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { OnboardingForm } from "@/features/onboarding/onboarding-form"
import { getProfileByClerkId } from "@/features/profile/queries"
import { isClerkConfigured } from "@/lib/clerk/config"
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin"

export default async function OnboardingPage() {
  if (!isClerkConfigured()) {
    return (
      <section className="mx-auto grid w-full max-w-4xl gap-8">
        <div>
          <Badge variant="outline">Onboarding</Badge>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            Clerk configuration required
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to
            `.env.local`, then restart the dev server.
          </p>
        </div>
      </section>
    )
  }

  const { userId } = await auth.protect()
  const profile = isSupabaseAdminConfigured()
    ? await getProfileByClerkId(userId)
    : null

  if (profile?.onboarding_completed_at) {
    redirect("/dashboard")
  }

  return (
    <section className="mx-auto grid w-full max-w-4xl gap-8">
      <div>
        <Badge variant="outline">Onboarding</Badge>
        <h1 className="mt-3 text-3xl font-semibold text-white">Build your profile system</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          This profile powers resume intelligence, auto apply decisions, mock interview context,
          and offer strategy across OfferPilot AI.
        </p>
      </div>
      <OnboardingForm />
    </section>
  )
}
