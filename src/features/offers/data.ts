import type { Offer, PipelineCard } from "./types"

export const mockOffers: Offer[] = [
  {
    id: "vanta-product-engineer",
    company: "Vanta",
    role: "Product Engineer",
    location: "Remote, US",
    compensation: "$165k - $190k",
    status: "Applied",
    owner: "Devki",
    appliedAt: "2026-05-28",
    nextStep: "Tailor follow-up with security workflow examples",
    score: 92,
    notes:
      "Strong TypeScript and workflow automation match. Emphasize AI review surfaces and auditability.",
  },
  {
    id: "stripe-frontend-platform",
    company: "Stripe",
    role: "Frontend Platform Engineer",
    location: "New York / Remote",
    compensation: "$185k - $225k",
    status: "Interview",
    owner: "Devki",
    appliedAt: "2026-05-22",
    nextStep: "Prep architecture stories for design systems and DX",
    score: 88,
    notes:
      "Interview loop is likely heavy on systems thinking. Keep examples concrete and metrics-led.",
  },
  {
    id: "linear-product-lead",
    company: "Linear",
    role: "Product Engineering Lead",
    location: "Remote",
    compensation: "$190k - $240k",
    status: "Offer",
    owner: "Devki",
    appliedAt: "2026-05-16",
    nextStep: "Compare equity, scope, and manager expectations",
    score: 94,
    notes:
      "High alignment with product-minded engineering. Offer review should focus on role scope and growth path.",
  },
  {
    id: "ramp-ai-workflows",
    company: "Ramp",
    role: "AI Workflow Engineer",
    location: "Remote, US",
    compensation: "$170k - $215k",
    status: "Rejected",
    owner: "Devki",
    appliedAt: "2026-05-08",
    nextStep: "Extract rejection feedback and update resume bullets",
    score: 76,
    notes:
      "Good technical fit, weaker fintech domain signal. Add measurable workflow automation outcomes.",
  },
]

export const mockPipelineCards: PipelineCard[] = [
  {
    id: "coda-product-systems",
    company: "Coda",
    role: "Product Systems Engineer",
    stage: "Applied",
    owner: "Devki",
    due: "Today",
    score: 84,
  },
  {
    id: "vanta-product-engineer",
    company: "Vanta",
    role: "Product Engineer",
    stage: "Screening",
    owner: "Devki",
    due: "Jun 4",
    score: 92,
  },
  {
    id: "stripe-frontend-platform",
    company: "Stripe",
    role: "Frontend Platform Engineer",
    stage: "Interview",
    owner: "Devki",
    due: "Jun 7",
    score: 88,
  },
  {
    id: "figma-ai-product",
    company: "Figma",
    role: "AI Product Engineer",
    stage: "Final Round",
    owner: "Devki",
    due: "Jun 11",
    score: 90,
  },
  {
    id: "linear-product-lead",
    company: "Linear",
    role: "Product Engineering Lead",
    stage: "Offer",
    owner: "Devki",
    due: "Jun 13",
    score: 94,
  },
  {
    id: "ramp-ai-workflows",
    company: "Ramp",
    role: "AI Workflow Engineer",
    stage: "Rejected",
    owner: "Devki",
    due: "Archive",
    score: 76,
  },
]

export function getMockOfferById(offerId: string) {
  return mockOffers.find((offer) => offer.id === offerId) ?? null
}
