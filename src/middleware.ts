import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { clerkPaths, isClerkConfigured } from "@/lib/clerk/config";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/offers(.*)",
  "/scoring(.*)",
  "/pipeline(.*)",
  "/team(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/onboarding(.*)",
]);

const clerkProtectedMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
}, {
  signInUrl: clerkPaths.signInUrl,
  signUpUrl: clerkPaths.signUpUrl,
});

export default function middleware(...args: Parameters<typeof clerkProtectedMiddleware>) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return clerkProtectedMiddleware(...args);
}

export const config = {
  matcher: [
    "/dashboard(.*)",
    "/offers(.*)",
    "/scoring(.*)",
    "/pipeline(.*)",
    "/team(.*)",
    "/profile(.*)",
    "/settings(.*)",
    "/onboarding(.*)",
  ],
};
