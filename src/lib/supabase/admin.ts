import "server-only"

import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

import { formatErrorForLog } from "@/features/profile/errors"

const supabaseFetchTimeoutMs = 15000

function hasUsableSecretValue(value: string | undefined): value is string {
  return Boolean(value && value.trim() && !value.includes("your_"))
}

type SupabaseUrlValidation = {
  reason: string
  safeUrl: string
  status: "invalid" | "missing" | "ready"
}

function validateSupabaseUrl(value: string | undefined): SupabaseUrlValidation {
  if (!value?.trim()) {
    return {
      reason: "NEXT_PUBLIC_SUPABASE_URL is missing.",
      safeUrl: "missing",
      status: "missing",
    }
  }

  try {
    const url = new URL(value.trim())
    const projectRef = url.hostname.slice(0, -".supabase.co".length)
    const safeUrl = `${url.protocol}//${url.hostname}`

    if (url.protocol !== "https:") {
      return {
        reason: "Supabase project URLs must use https.",
        safeUrl,
        status: "invalid",
      }
    }

    if (!url.hostname.endsWith(".supabase.co") || !projectRef) {
      return {
        reason: "Supabase project URLs must match https://<project-ref>.supabase.co.",
        safeUrl,
        status: "invalid",
      }
    }

    if (!/^[a-z0-9-]+$/i.test(projectRef)) {
      return {
        reason: "Supabase project ref contains unsupported characters.",
        safeUrl,
        status: "invalid",
      }
    }

    return {
      reason: "Supabase project URL is valid.",
      safeUrl,
      status: "ready",
    }
  } catch {
    return {
      reason: "NEXT_PUBLIC_SUPABASE_URL is not a parseable URL.",
      safeUrl: "unparseable",
      status: "invalid",
    }
  }
}

function hasValidSupabaseUrl(value: string | undefined): value is string {
  return validateSupabaseUrl(value).status === "ready"
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    hasValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      hasUsableSecretValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
  )
}

export function getSupabaseAdminConfigStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const urlValidation = validateSupabaseUrl(supabaseUrl)

  console.info("Validating NEXT_PUBLIC_SUPABASE_URL.", {
    reason: urlValidation.reason,
    status: urlValidation.status,
    url: urlValidation.safeUrl,
  })

  return {
    anonKey: getSecretStatus(anonKey),
    configured:
      urlValidation.status === "ready" && hasUsableSecretValue(serviceRoleKey),
    serviceRoleKey: getSecretStatus(serviceRoleKey),
    url: urlValidation.status,
  }
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const urlValidation = validateSupabaseUrl(supabaseUrl)

  if (
    urlValidation.status !== "ready" ||
    !supabaseUrl?.trim() ||
    !hasUsableSecretValue(serviceRoleKey)
  ) {
    console.warn(
      "Supabase server credentials are missing or invalid. Profile persistence is disabled until NEXT_PUBLIC_SUPABASE_URL is a valid https://<project-ref>.supabase.co URL and SUPABASE_SERVICE_ROLE_KEY is set.",
      {
        reason: urlValidation.reason,
        url: urlValidation.safeUrl,
      },
    )
    return null
  }

  return createClient<Database, "public", "public">(supabaseUrl.trim(), serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: async (input, init) => {
        const controller = new AbortController()
        const timeout = setTimeout(
          () => controller.abort(),
          supabaseFetchTimeoutMs,
        )

        try {
          return await fetch(input, {
            ...init,
            cache: "no-store",
            signal: init?.signal ?? controller.signal,
          })
        } catch (error) {
          const requestUrl = input instanceof Request ? input.url : String(input)
          const host = getRequestHost(requestUrl)
          const rootCause = formatErrorForLog(error)

          console.error("Supabase fetch failed.", {
            host,
            rootCause,
          })

          throw new Error(
            `Supabase fetch failed for ${host}. ${rootCause}`,
            { cause: error },
          )
        } finally {
          clearTimeout(timeout)
        }
      },
    },
  })
}

function getRequestHost(requestUrl: string) {
  try {
    return new URL(requestUrl).host
  } catch {
    return "unknown Supabase host"
  }
}

function getSecretStatus(value: string | undefined) {
  if (!value?.trim()) {
    return "missing"
  }

  return value.includes("your_") ? "placeholder" : "ready"
}
