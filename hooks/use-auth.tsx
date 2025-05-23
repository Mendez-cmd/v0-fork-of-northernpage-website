"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<{ error: any | null }>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  resendConfirmationEmail: (email: string) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user || null)

      // Check if user is admin
      if (session?.user) {
        setIsAdmin(session.user.user_metadata?.role === "admin")
      } else {
        setIsAdmin(false)
      }

      setIsLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)

        // Check if user is admin
        if (session?.user) {
          setIsAdmin(session.user.user_metadata?.role === "admin")
        } else {
          setIsAdmin(false)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getUser()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      // Get user to check if admin
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.user_metadata?.role === "admin") {
        router.push("/admin/dashboard")
        toast({
          title: "Welcome back, Admin!",
          description: "You have successfully logged in.",
        })
      } else {
        router.push("/")
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
      }
    }

    return { error }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    // Get the site URL from environment variable or use a fallback
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${siteUrl}/auth/confirm?type=email`,
      },
    })

    if (!error && data.user) {
      // Create user profile in the database
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
      })

      if (profileError) {
        return { error: profileError, data: null }
      }

      // Show confirmation message
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      })
    }

    return { error, data }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password?type=recovery`,
    })

    if (!error) {
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      })
    }

    return { error }
  }

  const resendConfirmationEmail = async (email: string) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/confirm?type=email`,
      },
    })

    if (!error) {
      toast({
        title: "Confirmation email sent",
        description: "Please check your email to confirm your account.",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send confirmation email.",
      })
    }

    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
        resendConfirmationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
