export const offerStatuses = ["Applied", "Interview", "Offer", "Rejected"] as const

export type OfferStatus = (typeof offerStatuses)[number]

export type Offer = {
  id: string
  company: string
  role: string
  location: string
  compensation: string
  status: OfferStatus
  owner: string
  appliedAt: string
  nextStep: string
  score: number
  notes: string
}

export const pipelineStages = [
  "Applied",
  "Screening",
  "Interview",
  "Final Round",
  "Offer",
  "Rejected",
] as const

export type PipelineStage = (typeof pipelineStages)[number]

export type PipelineCard = {
  id: string
  company: string
  role: string
  stage: PipelineStage
  owner: string
  due: string
  score: number
}
