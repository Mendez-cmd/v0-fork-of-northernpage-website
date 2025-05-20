import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      await supabase.auth.exchangeCodeForSession(code)
      // Redirect to success page after successful confirmation
      return NextResponse.redirect(new URL("/auth/confirm-success", request.url))
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Redirect to error page with details
      return NextResponse.redirect(
        new URL(`/auth/error?message=${encodeURIComponent("Failed to confirm email")}`, request.url),
      )
    }
  }

  // If no code is provided, redirect to home page
  return NextResponse.redirect(new URL("/", request.url))
}
