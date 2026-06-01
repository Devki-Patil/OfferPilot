import { SignUp } from "@clerk/nextjs"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { clerkPaths, isClerkConfigured } from "@/lib/clerk/config"

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return <ClerkSetupState title="Sign up unavailable" />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <SignUp
        fallbackRedirectUrl={clerkPaths.afterSignUpUrl}
        signInUrl={clerkPaths.signInUrl}
        appearance={{
          variables: {
            colorBackground: "#141416",
            colorInputBackground: "#0A0A0A",
            colorText: "#F4F4F5",
            colorPrimary: "#8B5CF6",
            borderRadius: "0.5rem",
          },
        }}
      />
    </main>
  )
}

function ClerkSetupState({ title }: { title: string }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-16">
      <section className="w-full max-w-lg">
        <Badge variant="destructive">Clerk setup</Badge>
        <Card className="mt-4 bg-card/90">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Add valid Clerk publishable and secret keys to `.env.local`, then
              restart the dev server.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </main>
  )
}
