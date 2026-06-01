import "server-only"

import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

const supabaseFetchTimeoutMs = 7000

function hasUsableValue(value: string | undefined): value is string {
  return Boolean(value && value.trim() && !value.includes("your_"))
}

function hasValidSupabaseUrl(value: string | undefined): value is string {
  if (!hasUsableValue(value)) {
    return false
  }

  try {
    const url = new URL(value!)

    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co")
  } catch {
    return false
  }
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    hasValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      hasUsableValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
  )
}

export function getSupabaseAdminConfigStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return {
    anonKey: getSecretStatus(anonKey),
    configured:
      hasValidSupabaseUrl(supabaseUrl) && hasUsableValue(serviceRoleKey),
    serviceRoleKey: getSecretStatus(serviceRoleKey),
    url: !supabaseUrl?.trim()
      ? "missing"
      : hasValidSupabaseUrl(supabaseUrl)
        ? "ready"
        : "invalid",
  }
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!hasValidSupabaseUrl(supabaseUrl) || !hasUsableValue(serviceRoleKey)) {
    console.warn(
      "Supabase server credentials are missing or invalid. Profile persistence is disabled until NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.",
    )
    return null
  }

  return createClient<Database, "public", "public">(supabaseUrl, serviceRoleKey, {
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
        } finally {
          clearTimeout(timeout)
        }
      },
    },
  })
}

function getSecretStatus(value: string | undefined) {
  if (!value?.trim()) {
    return "missing"
  }

  return value.includes("your_") ? "placeholder" : "ready"
}
