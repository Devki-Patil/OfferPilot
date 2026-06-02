import type { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardFrame } from "@/components/layout/dashboard-frame";
import { Topbar } from "@/components/layout/topbar";
import { getOrCreateProfileResultByClerkId } from "@/features/profile/queries";
import { isClerkConfigured } from "@/lib/clerk/config";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (isClerkConfigured()) {
    const { userId } = await auth.protect();

    if (isSupabaseAdminConfigured()) {
      const clerkUser = await currentUser().catch((error) => {
        console.error("Failed to load Clerk user while seeding profile.", error);
        return null;
      });
      const primaryEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? null;
      const fullName =
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
        clerkUser?.fullName ||
        primaryEmail;

      const profileResult = await getOrCreateProfileResultByClerkId(userId, {
        email: primaryEmail,
        fullName,
      });

      if (profileResult.status === "error") {
        console.error("Dashboard profile seed failed.", profileResult.error);
      }
    }
  }

  return (
    <div className="min-h-dvh lg:flex">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <DashboardFrame>{children}</DashboardFrame>
      </div>
    </div>
  );
}
