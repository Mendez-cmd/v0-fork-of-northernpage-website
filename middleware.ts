import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If accessing a protected route and not logged in, redirect to login
  if (!session && (req.nextUrl.pathname.startsWith("/account") || req.nextUrl.pathname.startsWith("/admin"))) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing admin routes, check if user has admin role
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Get user role from Supabase
    if (session) {
      const { data: userData, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

      // If user doesn't have admin role, redirect to home
      if (error || !userData || userData.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|auth/callback).*)"],
}
