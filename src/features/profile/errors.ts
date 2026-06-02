export type ProfileFailureReason =
  | "connection"
  | "not-configured"
  | "rls"
  | "schema"
  | "timeout"
  | "unknown"

type ErrorLike = {
  cause?: unknown
  code?: unknown
  details?: unknown
  hint?: unknown
  message?: unknown
  name?: unknown
  status?: unknown
}

export function getPostgrestFailureReason(error: {
  code?: string
  message?: string
}): ProfileFailureReason {
  if (error.code === "42P01") {
    return "schema"
  }

  if (error.code === "42501" || /row-level security/i.test(error.message ?? "")) {
    return "rls"
  }

  return "connection"
}

export function getUnknownFailureReason(error: unknown): ProfileFailureReason {
  const message = formatErrorForLog(error).toLowerCase()

  if (message.includes("timed out") || message.includes("abort")) {
    return "timeout"
  }

  return "connection"
}

export function getProfileErrorMessage(reason: ProfileFailureReason, details: string) {
  if (reason === "schema") {
    return "The Supabase profiles table is missing. Apply supabase/schema.sql, then retry."
  }

  if (reason === "rls") {
    return "Supabase rejected the profiles query because of Row Level Security or permissions."
  }

  if (reason === "timeout") {
    return `Supabase profile request timed out. Root cause: ${details}`
  }

  if (reason === "connection") {
    return `Supabase profile request failed. Root cause: ${details}`
  }

  return `Supabase profile request failed. Root cause: ${details}`
}

export function formatPostgrestErrorForLog(error: {
  code?: string
  details?: string | null
  hint?: string | null
  message?: string
}) {
  return compact([
    error.code ? `code=${error.code}` : null,
    error.message ? `message=${error.message}` : null,
    error.details ? `details=${error.details}` : null,
    error.hint ? `hint=${error.hint}` : null,
  ]).join("; ")
}

export function formatErrorForLog(error: unknown): string {
  if (!error) {
    return "Unknown error"
  }

  if (typeof error === "string") {
    return error
  }

  const errorLike = error as ErrorLike
  const parts = compact([
    typeof errorLike.name === "string" ? `name=${errorLike.name}` : null,
    typeof errorLike.message === "string" ? `message=${errorLike.message}` : null,
    typeof errorLike.code === "string" ? `code=${errorLike.code}` : null,
    typeof errorLike.status === "number" ? `status=${errorLike.status}` : null,
    typeof errorLike.details === "string" ? `details=${errorLike.details}` : null,
    typeof errorLike.hint === "string" ? `hint=${errorLike.hint}` : null,
  ])

  if (errorLike.cause) {
    parts.push(`cause=(${formatErrorForLog(errorLike.cause)})`)
  }

  if (parts.length) {
    return parts.join("; ")
  }

  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function compact<T>(items: Array<T | null | undefined>): T[] {
  return items.filter((item): item is T => item !== null && item !== undefined)
}
