export type JobSource = "greenhouse" | "lever" | "ashby" | "workday" | "manual"

export type AggregatedJob = {
  id: string
  source: JobSource
  sourceUrl: string
  title: string
  company: string
  location: string
  description: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  recruiterName?: string
  recruiterEmail?: string
  employmentType: "full-time" | "contract" | "part-time" | "internship"
  seniority?: "junior" | "mid" | "senior" | "lead" | "executive"
  skills: string[]
  postedAt: string
  expiresAt?: string
  applicantCount?: number
  isRemote: boolean
}

export type JobDiscoveryProfile = {
  targetRole: string
  skills: string[]
  location?: string | null
  salaryExpectation?: string | null
}

export type JobScore = {
  fit: number
  salaryConfidence: number
  recruiterPresence: number
  urgency: number
  overall: number
  reasons: string[]
}

export type RecommendedJob = AggregatedJob & {
  score: JobScore
  duplicateCount: number
  duplicateSources: JobSource[]
}

export type JobDiscoveryResult = {
  recommendations: RecommendedJob[]
  stats: {
    aggregated: number
    deduplicated: number
    fakeFiltered: number
    expiredFiltered: number
  }
}
