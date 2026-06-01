import type {
  AggregatedJob,
  JobDiscoveryProfile,
  JobDiscoveryResult,
  JobScore,
  RecommendedJob,
} from "./types"

const fakeJobSignals = [
  "training fee",
  "registration fee",
  "pay to apply",
  "whatsapp only",
  "telegram",
  "no interview required",
  "limited seats",
  "earn daily",
  "unlimited income",
]

export function discoverJobs(
  sources: AggregatedJob[],
  profile: JobDiscoveryProfile,
  now = new Date(),
): JobDiscoveryResult {
  const fakeFiltered = sources.filter(isLikelyFakeJob)
  const authenticJobs = sources.filter((job) => !isLikelyFakeJob(job))
  const expiredFiltered = authenticJobs.filter((job) => isExpiredJob(job, now))
  const activeJobs = authenticJobs.filter((job) => !isExpiredJob(job, now))
  const deduplicated = deduplicateJobs(activeJobs)

  const recommendations = deduplicated
    .map((job) => ({
      ...job,
      score: scoreJob(job, profile, now),
    }))
    .sort((a, b) => b.score.overall - a.score.overall)

  return {
    recommendations,
    stats: {
      aggregated: sources.length,
      deduplicated: activeJobs.length - deduplicated.length,
      fakeFiltered: fakeFiltered.length,
      expiredFiltered: expiredFiltered.length,
    },
  }
}

export function deduplicateJobs(jobs: AggregatedJob[]): RecommendedJob[] {
  const grouped = new Map<string, AggregatedJob[]>()

  for (const job of jobs) {
    const key = createDeduplicationKey(job)
    const group = grouped.get(key) ?? []
    group.push(job)
    grouped.set(key, group)
  }

  return Array.from(grouped.values()).map((group) => {
    const best = group
      .slice()
      .sort((a, b) => sourcePriority(b.source) - sourcePriority(a.source))[0]

    return {
      ...best,
      duplicateCount: group.length - 1,
      duplicateSources: group
        .filter((job) => job.id !== best.id)
        .map((job) => job.source),
      score: {
        fit: 0,
        salaryConfidence: 0,
        recruiterPresence: 0,
        urgency: 0,
        overall: 0,
        reasons: [],
      },
    }
  })
}

export function isLikelyFakeJob(job: AggregatedJob) {
  const searchable = `${job.title} ${job.company} ${job.description}`.toLowerCase()
  const hasFakeSignal = fakeJobSignals.some((signal) => searchable.includes(signal))
  const hasMissingCompany = job.company.trim().length < 2
  const hasSuspiciousContact =
    searchable.includes("@gmail.com") && !job.recruiterEmail?.includes(job.company.toLowerCase())

  return hasFakeSignal || hasMissingCompany || hasSuspiciousContact
}

export function isExpiredJob(job: AggregatedJob, now = new Date()) {
  if (job.expiresAt && new Date(job.expiresAt).getTime() < now.getTime()) {
    return true
  }

  const postedAt = new Date(job.postedAt)
  const ageInDays = (now.getTime() - postedAt.getTime()) / 86_400_000

  return ageInDays > 60
}

export function scoreJob(
  job: AggregatedJob,
  profile: JobDiscoveryProfile,
  now = new Date(),
): JobScore {
  const normalizedTitle = normalize(`${job.title} ${job.description}`)
  const targetTerms = normalize(profile.targetRole).split(" ").filter(Boolean)
  const matchingTargetTerms = targetTerms.filter((term) => normalizedTitle.includes(term)).length
  const titleFit = targetTerms.length
    ? Math.round((matchingTargetTerms / targetTerms.length) * 42)
    : 20

  const profileSkills = profile.skills.map(normalize).filter(Boolean)
  const jobSkills = job.skills.map(normalize)
  const matchingSkills = profileSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)),
  )
  const skillFit = profileSkills.length
    ? Math.round((matchingSkills.length / profileSkills.length) * 38)
    : 20

  const locationFit =
    job.isRemote || !profile.location || normalize(job.location).includes(normalize(profile.location))
      ? 20
      : 8

  const fit = clamp(titleFit + skillFit + locationFit)
  const salaryConfidence = calculateSalaryConfidence(job, profile.salaryExpectation)
  const recruiterPresence = calculateRecruiterPresence(job)
  const urgency = calculateUrgency(job, now)

  const overall = Math.round(
    fit * 0.5 + salaryConfidence * 0.18 + recruiterPresence * 0.14 + urgency * 0.18,
  )

  const reasons = [
    matchingSkills.length ? `${matchingSkills.length} skill signals matched` : "Limited skill overlap",
    job.recruiterName || job.recruiterEmail ? "Recruiter contact present" : "Recruiter signal missing",
    salaryConfidence >= 70 ? "Salary band is clear" : "Salary needs confirmation",
    urgency >= 70 ? "Fresh or fast-moving role" : "Standard urgency",
  ]

  return {
    fit,
    salaryConfidence,
    recruiterPresence,
    urgency,
    overall,
    reasons,
  }
}

function createDeduplicationKey(job: AggregatedJob) {
  return [normalize(job.company), normalize(job.title), normalize(job.location)]
    .join(":")
    .replace(/[^a-z0-9:]/g, "")
}

function sourcePriority(source: AggregatedJob["source"]) {
  const priorities: Record<AggregatedJob["source"], number> = {
    greenhouse: 5,
    lever: 5,
    ashby: 5,
    workday: 4,
    manual: 1,
  }

  return priorities[source]
}

function calculateSalaryConfidence(job: AggregatedJob, expectation?: string | null) {
  if (!job.salaryMin && !job.salaryMax) {
    return 28
  }

  const hasRange = Boolean(job.salaryMin && job.salaryMax)
  const expectationNumber = extractSalaryExpectation(expectation)
  const salaryMax = job.salaryMax ?? job.salaryMin ?? 0
  const expectationFit = expectationNumber ? salaryMax >= expectationNumber * 0.92 : true

  return clamp((hasRange ? 72 : 54) + (expectationFit ? 18 : -18))
}

function calculateRecruiterPresence(job: AggregatedJob) {
  if (job.recruiterName && job.recruiterEmail) {
    return 96
  }

  if (job.recruiterName || job.recruiterEmail) {
    return 74
  }

  return 35
}

function calculateUrgency(job: AggregatedJob, now: Date) {
  const postedAt = new Date(job.postedAt)
  const ageInDays = Math.max(0, (now.getTime() - postedAt.getTime()) / 86_400_000)
  const applicantPressure = job.applicantCount ? Math.max(0, 24 - job.applicantCount / 10) : 12
  const freshness = Math.max(22, 78 - ageInDays * 3)

  return clamp(Math.round(freshness + applicantPressure))
}

function extractSalaryExpectation(expectation?: string | null) {
  const match = expectation?.replace(/,/g, "").match(/\d+/)

  if (!match) {
    return null
  }

  const value = Number(match[0])

  return value < 1000 ? value * 1000 : value
}

function normalize(value?: string | null) {
  return (value ?? "").toLowerCase().trim()
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}
