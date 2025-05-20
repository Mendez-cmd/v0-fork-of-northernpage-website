"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Check, Loader2 } from "lucide-react"

export function DbSetupWishlist() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const createWishlistTable = async () => {
    setIsLoading(true)
    try {
      // Create the wishlist table
      const { error } = await supabase.rpc("create_wishlist_table")

      if (error) throw error

      toast({
        title: "Success",
        description: "Wishlist table created successfully.",
      })
      setIsComplete(true)
    } catch (error) {
      console.error("Error creating wishlist table:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create wishlist table. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-2">Wishlist Table Setup</h3>
      <p className="text-gray-600 mb-4">Create the wishlist table to enable users to save their favorite products.</p>
      <Button
        onClick={createWishlistTable}
        disabled={isLoading || isComplete}
        className="bg-gold hover:bg-amber-500 text-black"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : isComplete ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Completed
          </>
        ) : (
          "Create Wishlist Table"
        )}
      </Button>
    </div>
  )
}
