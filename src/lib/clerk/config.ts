const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkSecretKey = process.env.CLERK_SECRET_KEY

function hasUsableValue(value: string | undefined, prefix: string) {
  return Boolean(value && value.startsWith(prefix) && !value.includes("your_"))
}

export function isClerkConfigured() {
  return (
    hasUsableValue(clerkPublishableKey, "pk_") &&
    hasUsableValue(clerkSecretKey, "sk_")
  )
}

export const clerkPaths = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in",
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up",
  afterSignInUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || "/dashboard",
  afterSignUpUrl:
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || "/onboarding",
}
