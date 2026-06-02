import { createSupabaseAdminClient, getSupabaseAdminConfigStatus } from "@/lib/supabase/admin"
import {
  formatErrorForLog,
  formatPostgrestErrorForLog,
  getPostgrestFailureReason,
} from "./errors"

export type ProfileStoreHealth =
  | {
      config: ReturnType<typeof getSupabaseAdminConfigStatus>
      description: string
      profileCount: number | null
      status: "ready"
      title: string
    }
  | {
      config: ReturnType<typeof getSupabaseAdminConfigStatus>
      description: string
      profileCount: null
      status: "not-configured" | "schema-missing" | "unavailable"
      title: string
    }

const healthTimeoutMs = 4500

export async function getProfileStoreHealth(): Promise<ProfileStoreHealth> {
  const config = getSupabaseAdminConfigStatus()

  if (!config.configured) {
    return {
      config,
      description:
        "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable saved profiles.",
      profileCount: null,
      status: "not-configured",
      title: "Supabase env incomplete",
    }
  }

  const supabase = createSupabaseAdminClient()

  if (!supabase) {
    return {
      config,
      description:
        "Supabase credentials are present but not usable by the server runtime.",
      profileCount: null,
      status: "not-configured",
      title: "Supabase env invalid",
    }
  }

  try {
    const { count, error } = await withTimeout(
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      healthTimeoutMs,
      "Supabase profile health check timed out.",
    )

    if (error) {
      if (error.code === "42P01") {
        console.error("Supabase profile health check failed.", {
          details: formatPostgrestErrorForLog(error),
          reason: "schema",
        })

        return {
          config,
          description:
            "Run supabase/schema.sql to create public.profiles, its index, trigger, and service-role policy.",
          profileCount: null,
          status: "schema-missing",
          title: "Profiles table missing",
        }
      }

      const reason = getPostgrestFailureReason(error)
      const details = formatPostgrestErrorForLog(error)

      console.error("Supabase profile health check failed.", {
        details,
        reason,
      })

      return {
        config,
        description: `Supabase profile health check failed: ${details}`,
        profileCount: null,
        status: "unavailable",
        title: "Supabase unavailable",
      }
    }

    return {
      config,
      description: "Profile persistence is connected and the profiles table is reachable.",
      profileCount: count ?? 0,
      status: "ready",
      title: "Profiles table ready",
    }
  } catch (error) {
    const details = formatErrorForLog(error)

    console.error("Supabase profile health check failed.", {
      details,
    })

    return {
      config,
      description: `Supabase profile health check failed: ${details}`,
      profileCount: null,
      status: "unavailable",
      title: "Supabase unavailable",
    }
  }
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
