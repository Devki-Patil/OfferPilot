import "server-only"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/types/database"

import { mockOffers, mockPipelineCards } from "./data"
import {
  offerStatuses,
  pipelineStages,
  type Offer,
  type OfferStatus,
  type PipelineCard,
  type PipelineStage,
} from "./types"

type OfferRow = Database["public"]["Tables"]["offers"]["Row"]
type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"]

const offerLookupTimeoutMs = 15000

export async function getOffersForProfile(profileId?: string | null): Promise<Offer[]> {
  if (!profileId) {
    return mockOffers
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return mockOffers
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("offers")
        .select("*")
        .eq("profile_id", profileId)
        .order("applied_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }),
      offerLookupTimeoutMs,
      "Supabase offers lookup timed out.",
    )

    if (error) {
      console.error("Failed to load offers from Supabase.", {
        details: error.message,
        profileId,
      })
      return mockOffers
    }

    return data.map(mapOfferRow)
  } catch (error) {
    console.error("Failed to load offers from Supabase.", { error, profileId })
    return mockOffers
  }
}

export async function getOfferByIdOrSlug(
  offerId: string,
  profileId?: string | null,
): Promise<Offer | null> {
  if (!profileId) {
    return mockOffers.find((offer) => offer.id === offerId) ?? null
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return mockOffers.find((offer) => offer.id === offerId) ?? null
  }

  try {
    const bySlug = await withTimeout(
      supabase
        .from("offers")
        .select("*")
        .eq("profile_id", profileId)
        .eq("slug", offerId)
        .maybeSingle(),
      offerLookupTimeoutMs,
      "Supabase offer lookup timed out.",
    )

    if (bySlug.error) {
      console.error("Failed to load offer by slug from Supabase.", {
        details: bySlug.error.message,
        offerId,
        profileId,
      })
      return mockOffers.find((offer) => offer.id === offerId) ?? null
    }

    if (bySlug.data) {
      return mapOfferRow(bySlug.data)
    }

    if (!isUuid(offerId)) {
      return null
    }

    const byId = await withTimeout(
      supabase
        .from("offers")
        .select("*")
        .eq("profile_id", profileId)
        .eq("id", offerId)
        .maybeSingle(),
      offerLookupTimeoutMs,
      "Supabase offer lookup timed out.",
    )

    if (byId.error) {
      console.error("Failed to load offer by id from Supabase.", {
        details: byId.error.message,
        offerId,
        profileId,
      })
      return mockOffers.find((offer) => offer.id === offerId) ?? null
    }

    return byId.data ? mapOfferRow(byId.data) : null
  } catch (error) {
    console.error("Failed to load offer from Supabase.", { error, offerId, profileId })
    return mockOffers.find((offer) => offer.id === offerId) ?? null
  }
}

export async function getPipelineCardsForProfile(
  profileId?: string | null,
): Promise<PipelineCard[]> {
  if (!profileId) {
    return mockPipelineCards
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return mockPipelineCards
  }

  try {
    const { data, error } = await withTimeout(
      supabase
        .from("applications")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false }),
      offerLookupTimeoutMs,
      "Supabase applications lookup timed out.",
    )

    if (error) {
      console.error("Failed to load applications from Supabase.", {
        details: error.message,
        profileId,
      })
      return mockPipelineCards
    }

    return data.map(mapApplicationRowToPipelineCard)
  } catch (error) {
    console.error("Failed to load applications from Supabase.", { error, profileId })
    return mockPipelineCards
  }
}

function mapOfferRow(row: OfferRow): Offer {
  return {
    id: row.slug || row.id,
    company: row.company,
    role: row.role,
    location: row.location,
    compensation: row.compensation,
    status: toOfferStatus(row.status),
    owner: row.owner,
    appliedAt: row.applied_at ?? "",
    nextStep: row.next_step,
    score: clampScore(row.score),
    notes: row.notes,
  }
}

function mapApplicationRowToPipelineCard(row: ApplicationRow): PipelineCard {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    stage: toPipelineStage(row.stage),
    owner: row.owner,
    due: row.due_label || "Next",
    score: clampScore(row.score),
  }
}

function toOfferStatus(value: string): OfferStatus {
  return offerStatuses.includes(value as OfferStatus) ? (value as OfferStatus) : "Applied"
}

function toPipelineStage(value: string): PipelineStage {
  return pipelineStages.includes(value as PipelineStage)
    ? (value as PipelineStage)
    : "Applied"
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

function withTimeout<T>(
  promise: PromiseLike<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), timeoutMs)
  })

  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => {
    clearTimeout(timeout)
  })
}
