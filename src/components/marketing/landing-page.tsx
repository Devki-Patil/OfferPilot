import Link from "next/link"
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  FileSearch,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    id: "ats-resume-intelligence",
    eyebrow: "ATS resume intelligence",
    title: "Turn every resume into a ranked offer strategy.",
    description:
      "OfferPilot AI reads resume signals, job descriptions, compensation bands, and hiring notes to surface the strongest match path before outreach begins.",
    icon: FileSearch,
    stats: ["92% match clarity", "34s resume read", "12 signal groups"],
  },
  {
    id: "auto-apply-showcase",
    eyebrow: "Auto apply showcase",
    title: "Apply with precision, not volume.",
    description:
      "Build role-specific applications, tailor positioning, and queue compliant outreach workflows from one quiet command center.",
    icon: WandSparkles,
    stats: ["4.8x more relevant", "1-click queue", "Policy checks"],
  },
  {
    id: "mock-interview-preview",
    eyebrow: "Mock interview preview",
    title: "Practice with interviews that remember the role.",
    description:
      "Simulate recruiter, hiring manager, and panel loops with calibrated follow-ups, scorecards, and improvement prompts.",
    icon: MessageSquareText,
    stats: ["Live scorecards", "Role memory", "Replay insights"],
  },
]

const testimonials = [
  {
    quote:
      "OfferPilot feels like a senior recruiting operator sitting inside the workflow. It gives our team sharper signals without adding noise.",
    name: "Maya Chen",
    role: "Head of Talent, Northstar Labs",
  },
  {
    quote:
      "The product makes candidate preparation feel premium and exact. Our offer cycles are cleaner because everyone sees the same intelligence.",
    name: "Andre Wallace",
    role: "Revenue Operations, AlloyWorks",
  },
  {
    quote:
      "We replaced scattered spreadsheets and interview notes with one calm workspace. The experience is fast, polished, and remarkably focused.",
    name: "Priya Raman",
    role: "Founder, SignalPath",
  },
]

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For solo operators building a focused application system.",
    features: ["Resume intelligence", "Offer tracker", "Mock interview sessions"],
  },
  {
    name: "Pro",
    price: "$79",
    description: "For candidates and teams running high-intent offer pipelines.",
    features: ["Auto apply workflows", "ATS scoring", "Priority interview coaching"],
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For organizations standardizing offer intelligence.",
    features: ["Team workspaces", "Custom compliance rules", "Dedicated success"],
  },
]

const faqs = [
  {
    question: "Does OfferPilot AI replace recruiters or career coaches?",
    answer:
      "No. It gives teams and candidates a structured intelligence layer so humans can make better decisions faster.",
  },
  {
    question: "Can workflows be reviewed before anything is sent?",
    answer:
      "Yes. Auto apply queues are built for review, policy checks, and approval before execution.",
  },
  {
    question: "Is the product ready for team environments?",
    answer:
      "The structure supports teams, shared pipelines, and role-based expansion as production data sources are connected.",
  },
]

export function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <HeroSection />
      <ProductPreviewSection />
      <IntelligenceSections />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <StickyCta />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-center border-b border-border px-4 py-24 sm:px-6 lg:px-8">
      <ProductScene className="absolute inset-x-0 bottom-0 top-20 opacity-50" />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <Badge variant="outline">Offer intelligence for modern teams</Badge>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          OfferPilot AI
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          A composed workspace for resume intelligence, auto apply workflows,
          mock interviews, and offer decisions from the first signal to the final
          yes.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Launch dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#product-preview">
              <Play className="size-4" aria-hidden="true" />
              View product
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function ProductPreviewSection() {
  return (
    <section id="product-preview" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Product preview"
          title="A command center with a quiet premium operating rhythm."
          description="Signal cards, application queues, interview readiness, and offer motion stay readable in one matte dashboard."
        />
        <div className="mt-12 overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset,0_24px_72px_rgb(0_0_0_/_34%)]">
          <ProductScene className="relative h-[34rem]" />
        </div>
      </div>
    </section>
  )
}

function IntelligenceSections() {
  return (
    <section className="border-y border-border bg-[#0c0c0d] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6">
        {sections.map((section) => {
          const Icon = section.icon

          return (
            <article
              key={section.id}
              id={section.id}
              className="grid gap-6 rounded-lg border border-border bg-card p-5 shadow-[0_1px_0_rgb(255_255_255_/_5%)_inset] lg:grid-cols-[1fr_0.9fr] lg:p-8"
            >
              <div>
                <div className="mb-5 flex size-10 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <Badge variant="outline">{section.eyebrow}</Badge>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold text-white sm:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {section.description}
                </p>
              </div>
              <FeaturePanel stats={section.stats} />
            </article>
          )
        })}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Built for teams that care about signal, speed, and polish."
          description="The product stays minimal on purpose, so the intelligence can do the work."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-card/86">
              <CardContent className="p-5">
                <p className="text-sm leading-7 text-foreground/86">&quot;{item.quote}&quot;</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="border-y border-border bg-[#0c0c0d] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Start focused. Scale when the workflow earns it."
          description="Simple plans for premium offer operations, from individual pipelines to full team systems."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-white/18 bg-graphite-elevated" : "bg-card/86"}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.featured && <Badge>Most selected</Badge>}
                </div>
                <div className="mt-5 flex items-end gap-1">
                  <span className="font-analytics text-4xl font-semibold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="pb-1 text-sm text-muted-foreground">/mo</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground/86">
                      <Check className="size-4 text-muted-foreground" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  <Link href="/dashboard">{plan.featured ? "Start Pro" : "Get started"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions before takeoff."
          description="A few details for teams evaluating OfferPilot AI as a production SaaS workspace."
        />
        <div className="mt-10 divide-y divide-border rounded-lg border border-border bg-card">
          {faqs.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="cursor-pointer list-none text-sm font-medium text-white">
                <span className="flex items-center justify-between gap-6">
                  {item.question}
                  <span className="text-muted-foreground">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-lg border border-border bg-[#111113] p-2 shadow-[0_18px_56px_rgb(0_0_0_/_42%)]">
        <div className="min-w-0 px-2">
          <p className="truncate text-sm font-medium text-white">Build your offer pipeline</p>
          <p className="truncate text-xs text-muted-foreground">Resume, apply, interview, decide.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            Start
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge variant="outline">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </div>
  )
}

function ProductScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute left-1/2 top-1/2 grid h-[82%] w-[86%] max-w-5xl -translate-x-1/2 -translate-y-1/2 grid-cols-[13rem_1fr] overflow-hidden rounded-lg border border-white/[0.08] bg-[#101012] shadow-[0_1px_0_rgb(255_255_255_/_6%)_inset,0_28px_86px_rgb(0_0_0_/_44%)]">
        <div className="hidden border-r border-border bg-[#0d0d0e] p-4 md:block">
          <div className="mb-8 flex items-center gap-2">
            <span className="size-8 rounded-md border border-border bg-secondary" />
            <span className="h-3 w-24 rounded-full bg-white/18" />
          </div>
          {["Dashboard", "Resume IQ", "Auto Apply", "Interview", "Offers"].map((item, index) => (
            <div
              key={item}
              className={`mb-2 flex h-9 items-center gap-3 rounded-md border px-3 text-xs text-muted-foreground ${
                index === 1
                  ? "border-white/[0.08] bg-white/[0.06] text-foreground"
                  : "border-transparent"
              }`}
            >
              <span className="size-2 rounded-full bg-white/24" />
              {item}
            </div>
          ))}
        </div>
        <div className="col-span-2 grid grid-rows-[4rem_1fr] md:col-span-1">
          <div className="flex items-center justify-between border-b border-border px-5">
            <div>
              <div className="h-3 w-36 rounded-full bg-white/22" />
              <div className="mt-2 h-2 w-56 rounded-full bg-white/10" />
            </div>
            <div className="hidden h-8 w-24 rounded-md border border-border bg-secondary sm:block" />
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="h-3 w-24 rounded-full bg-white/20" />
                <ShieldCheck className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              {[86, 64, 78, 51].map((width) => (
                <div key={width} className="mb-4">
                  <div className="mb-2 flex justify-between">
                    <span className="h-2 w-24 rounded-full bg-white/10" />
                    <span className="font-analytics text-xs text-muted-foreground">{width}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full bg-white/70" style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4">
              <MiniPanel icon={Bot} title="Auto apply" />
              <MiniPanel icon={BriefcaseBusiness} title="Offer motion" />
              <MiniPanel icon={Sparkles} title="Interview readiness" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniPanel({
  icon: Icon,
  title,
}: {
  icon: typeof Bot
  title: string
}) {
  return (
    <div className="rounded-lg border border-border bg-[#17171a] p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <div className="mt-4 space-y-2">
        <span className="block h-2 w-full rounded-full bg-white/10" />
        <span className="block h-2 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

function FeaturePanel({ stats }: { stats: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-[#101012] p-4">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {stats.map((stat) => (
          <div
            key={stat}
            className="rounded-md border border-border bg-white/[0.035] p-4"
          >
            <p className="font-analytics text-2xl font-semibold text-white">{stat}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Continuously refined as new role and candidate signals enter the
              workspace.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
