import { auth, currentUser } from "@clerk/nextjs/server";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileText,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { JobRecommendationCard } from "@/components/jobs/job-recommendation-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { discoverJobs } from "@/features/jobs/engine";
import { getAggregatedJobSources } from "@/features/jobs/mock-sources";
import {
  createDemoProfile,
  getOrCreateProfileResultByClerkId,
  normalizeProfile,
} from "@/features/profile/queries";
import { isClerkConfigured } from "@/lib/clerk/config";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isClerkConfigured()) {
    return (
      <DashboardContent
        notice={{
          title: "Demo mode",
          description:
            "Clerk is not configured, so the dashboard is running with local demo data.",
          variant: "warning",
        }}
        profile={createDemoProfile()}
      />
    );
  }

  const { userId } = await auth();
  const clerkUser = await currentUser().catch((error) => {
    console.error("Failed to load Clerk user details for profile seed.", error);
    return null;
  });

  const primaryEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? null;
  const fullName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.fullName ||
    primaryEmail;

  if (!userId) {
    return (
      <DashboardContent
        notice={{
          title: "Signed-out demo",
          description:
            "Sign in to load saved profile data. Demo data is active so the dashboard remains usable.",
          variant: "warning",
        }}
        profile={createDemoProfile({ email: primaryEmail, fullName })}
      />
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return (
      <DashboardContent
        notice={{
          title: "Supabase not configured",
          description:
            "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable saved profile data. Demo data is active for now.",
          variant: "warning",
        }}
        profile={createDemoProfile({ email: primaryEmail, fullName })}
      />
    );
  }

  const profileResult = await getOrCreateProfileResultByClerkId(userId, {
    email: primaryEmail,
    fullName,
  });

  if (profileResult.status === "ready") {
    if (!profileResult.data.onboarding_completed_at) {
      return <DashboardEmptyState />;
    }

    return <DashboardContent profile={profileResult.data} />;
  }

  if (profileResult.status === "empty") {
    return <DashboardEmptyState />;
  }

  return (
    <DashboardContent
      notice={{
        title:
          profileResult.reason === "schema"
            ? "Supabase table missing"
            : "Supabase unavailable",
        description: `${profileResult.error} Demo data is active so the dashboard stays usable.`,
        variant: profileResult.reason === "schema" ? "destructive" : "warning",
      }}
      profile={createDemoProfile({ email: primaryEmail, fullName })}
    />
  );
}

type DashboardNoticeData = {
  title: string;
  description: string;
  variant: "warning" | "destructive";
};

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function DashboardContent({
  profile,
  notice,
}: {
  profile: Profile;
  notice?: DashboardNoticeData;
}) {
  const safeProfile = normalizeProfile(profile);
  const targetRole = safeProfile.target_role;
  const discovery = discoverJobs(getAggregatedJobSources(targetRole), {
    targetRole,
    skills: safeProfile.skills,
    location: safeProfile.location,
    salaryExpectation: safeProfile.salary_expectation,
  });
  const jobRecommendations = discovery.recommendations.slice(0, 4);
  const averageFit = Math.round(
    jobRecommendations.reduce((total, job) => total + job.score.fit, 0) /
      Math.max(jobRecommendations.length, 1),
  );

  const resumeInsights = [
    { label: "ATS readiness", value: "86", detail: "Strong keyword coverage" },
    { label: "Role alignment", value: "91", detail: "Target profile is focused" },
    { label: "Signal clarity", value: "78", detail: "Projects can be sharper" },
  ];

  const applications = [
    { company: "Vanta", role: targetRole, status: "Recommended", date: "Today" },
    { company: "Stripe", role: `Senior ${targetRole}`, status: "Resume review", date: "Next" },
    { company: "Linear", role: `${targetRole} Lead`, status: "Interview prep", date: "Queued" },
    { company: "Ramp", role: targetRole, status: "Saved", date: "Draft" },
  ];

  const activities = [
    {
      icon: FileText,
      label: "Resume parsed",
      value: safeProfile.resume_path ? "Complete" : "Pending upload",
    },
    {
      icon: Sparkles,
      label: "Profile signals",
      value: `${safeProfile.skills.length} skills indexed`,
    },
    { icon: Target, label: "Target role", value: targetRole },
    { icon: CalendarClock, label: "Interview readiness", value: "Mock loop available" },
  ];

  return (
    <section className="flex flex-1 flex-col gap-8">
      {notice && <DashboardNotice notice={notice} />}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Badge variant="outline">Workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Good to see you, {safeProfile.full_name.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your offer pipeline is tuned for {targetRole}. Review recommendations,
            resume signals, application status, and today&apos;s activity.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-card p-3 shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset]">
          <Metric label="Match avg" value={`${averageFit}%`} />
          <Metric
            label="Filtered"
            value={`${discovery.stats.fakeFiltered + discovery.stats.expiredFiltered}`}
          />
          <Metric label="Merged" value={`${discovery.stats.deduplicated}`} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="bg-card/90">
          <CardHeader className="flex-row items-start justify-between gap-6">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="size-4 text-muted-foreground" aria-hidden="true" />
                Job recommendations
              </CardTitle>
              <CardDescription>
                Aggregated, deduplicated, filtered, and scored against your profile.
              </CardDescription>
            </div>
            <Badge>{discovery.stats.aggregated} sources scanned</Badge>
          </CardHeader>
          <CardContent className="grid gap-3">
            {jobRecommendations.length > 0 ? (
              jobRecommendations.map((job) => (
                <JobRecommendationCard key={job.id} job={job} />
              ))
            ) : (
              <EmptyPanel
                title="No recommendations yet"
                description="Complete your profile with a target role and skills to generate job recommendations."
              />
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
              Resume insights
            </CardTitle>
            <CardDescription>
              ATS and positioning signals generated from your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {resumeInsights.map((insight) => (
              <div key={insight.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{insight.label}</p>
                    <p className="text-xs text-muted-foreground">{insight.detail}</p>
                  </div>
                  <span className="font-analytics text-lg font-semibold text-white">
                    {insight.value}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-white/72"
                    style={{ width: `${insight.value}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="bg-card/90">
          <CardHeader className="flex-row items-start justify-between gap-6">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Send className="size-4 text-muted-foreground" aria-hidden="true" />
                Application tracker
              </CardTitle>
              <CardDescription>
                Current offer motion across recommended and queued applications.
              </CardDescription>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              {applications.map((application, index) => (
                <div
                  key={`${application.company}-${application.status}`}
                  className="grid gap-3 border-b border-border bg-graphite px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_10rem_5rem]"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{application.company}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{application.role}</p>
                  </div>
                  <div className="self-center">
                    <Badge
                      variant={
                        index === 0 ? "success" : index === 1 ? "warning" : "outline"
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <p className="self-center font-analytics text-xs text-muted-foreground sm:text-right">
                    {application.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-muted-foreground" aria-hidden="true" />
              Activity summary
            </CardTitle>
            <CardDescription>
              A clean snapshot of what OfferPilot AI has indexed for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-graphite p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{activity.value}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function DashboardEmptyState() {
  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <Badge variant="outline">Workspace</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Complete onboarding
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Your dashboard is ready, but it needs profile signals before job
          recommendations, resume insights, and activity summaries can render.
        </p>
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle>Profile required</CardTitle>
          <CardDescription>
            Add your target role, skills, location, and resume context to unlock
            the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/onboarding"
            className="inline-flex h-9 items-center justify-center rounded-md border border-primary/55 bg-primary px-3 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_rgb(255_255_255_/_10%)_inset,0_14px_34px_rgb(139_92_246_/_24%)] transition-colors hover:bg-primary/90"
          >
            Open onboarding
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}

function DashboardNotice({
  notice,
}: {
  notice: DashboardNoticeData;
}) {
  const isDestructive = notice.variant === "destructive";

  return (
    <Card
      className={
        isDestructive
          ? "border-destructive/20 bg-destructive/10"
          : "border-amber-400/16 bg-amber-400/8"
      }
    >
      <CardHeader className="gap-2">
        <Badge variant={isDestructive ? "destructive" : "warning"}>
          {notice.title}
        </Badge>
        <CardDescription className="max-w-3xl text-foreground/82">
          {notice.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-graphite p-6">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-20 px-2 py-1 text-center">
      <p className="font-analytics text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
