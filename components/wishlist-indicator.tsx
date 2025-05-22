"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

export function WishlistIndicator() {
  const [count, setCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  // Check if user is logged in and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUserId(session.user.id)
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [supabase])

  // Get wishlist count
  useEffect(() => {
    if (!userId) return

    const getWishlistCount = async () => {
      try {
        const { count, error } = await supabase
          .from("wishlist")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)

        if (error) {
          if (error.message.includes("does not exist")) {
            // Wishlist table doesn't exist, skip
            setCount(0)
          } else {
            throw error
          }
        } else {
          setCount(count || 0)
        }
      } catch (error) {
        console.error("Error getting wishlist count:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getWishlistCount()

    // Subscribe to changes
    const channel = supabase
      .channel("wishlist_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          getWishlistCount()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  if (isLoading || !userId) return null

  return (
    <Link href="/account?tab=wishlist" className="relative flex items-center">
      <Heart className="h-6 w-6" />
      {count > 0 && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
          {count}
        </Badge>
      )}
      <span className="sr-only">Wishlist</span>
    </Link>
  )
}
