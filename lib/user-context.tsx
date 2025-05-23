"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type User = {
  id: string
  email: string
  first_name?: string
  last_name?: string
} | null

type UserContextType = {
  user: User
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const refreshUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        // Get user profile data
        const { data: profileData } = await supabase
          .from("users")
          .select("id, email, first_name, last_name")
          .eq("id", authUser.id)
          .single()

        setUser(profileData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <UserContext.Provider value={{ user, loading, refreshUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
