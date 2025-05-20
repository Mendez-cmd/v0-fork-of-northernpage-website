import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "../database.types"

export function createClient() {
  const cookieStore = cookies()

  // Log the environment variables (without sensitive values)
  console.log("SUPABASE_URL available:", !!process.env.SUPABASE_URL)
  console.log("SUPABASE_ANON_KEY available:", !!process.env.SUPABASE_ANON_KEY)

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_ANON_KEY,
  })
}
