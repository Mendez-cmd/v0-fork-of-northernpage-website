"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { addToWishlist, removeFromWishlist } from "@/lib/wishlist"

interface WishlistButtonProps {
  productId: string
  variant?: "icon" | "button"
  className?: string
}

export function WishlistButton({ productId, variant = "icon", className = "" }: WishlistButtonProps) {
  const [isInList, setIsInList] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [wishlistId, setWishlistId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  // Check if user is logged in and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUserId(session.user.id)
      }
    }

    checkAuth()
  }, [supabase])

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId) return

      try {
        // Check if the item is in wishlist
        const { data, error } = await supabase
          .from("wishlist")
          .select("id")
          .eq("user_id", userId)
          .eq("product_id", productId)
          .maybeSingle()

        if (error) {
          if (error.message.includes("does not exist")) {
            // Wishlist table doesn't exist, skip
            return
          }
          throw error
        }

        if (data) {
          setIsInList(true)
          setWishlistId(data.id)
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      }
    }

    checkWishlist()
  }, [userId, productId, supabase])

  const toggleWishlist = async () => {
    if (!userId) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save items to your wishlist.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isInList && wishlistId) {
        // Remove from wishlist
        const result = await removeFromWishlist(wishlistId)

        if (result.success) {
          setIsInList(false)
          setWishlistId(null)
          toast({
            title: "Removed from wishlist",
            description: "The item has been removed from your wishlist.",
          })
        } else {
          throw new Error(result.message)
        }
      } else {
        // Add to wishlist
        const result = await addToWishlist(userId, productId)

        if (result.success) {
          setIsInList(true)

          // Get the new wishlist item ID
          const { data } = await supabase
            .from("wishlist")
            .select("id")
            .eq("user_id", userId)
            .eq("product_id", productId)
            .maybeSingle()

          if (data) {
            setWishlistId(data.id)
          }

          toast({
            title: "Added to wishlist",
            description: "The item has been added to your wishlist.",
          })
        } else {
          throw new Error(result.message)
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Something went wrong",
        description: "There was an error updating your wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <button
        onClick={toggleWishlist}
        disabled={isLoading}
        className={`flex items-center justify-center p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 ${
          isInList ? "text-red-500" : ""
        } ${className} ${isLoading ? "opacity-70" : ""}`}
        aria-label={isInList ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-5 w-5 ${isInList ? "fill-current" : ""}`} />
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center gap-2 ${isInList ? "text-red-500" : ""} ${className}`}
    >
      <Heart className={`h-4 w-4 ${isInList ? "fill-current" : ""}`} />
      {isInList ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
