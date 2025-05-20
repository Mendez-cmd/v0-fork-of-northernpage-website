import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function redirectIfAuthenticated() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/")
  }
}

export async function redirectIfNotAuthenticated() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function getAuthUser() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

export function getSupabaseCallbackUrl(type: string) {
  // In production, use the actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/auth/callback?type=${type}`
}
