"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import { Star, Package } from "lucide-react"

interface ReviewsTabProps {
  userId: string
}

export function ReviewsTab({ userId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from("reviews")
          .select(`
            *,
            products (*)
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error

        setReviews(data || [])
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [userId, supabase])

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => <Star key={i} className={`h-4 w-4 ${i < rating ? "text-gold fill-gold" : "text-gray-300"}`} />)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">My Reviews</h2>
      <p className="text-gray-600 mb-6">Reviews you've left for products.</p>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                  {review.products?.image_url ? (
                    <img
                      src={review.products.image_url || "/placeholder.svg"}
                      alt={review.products.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{review.products?.name || "Product"}</h3>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                  <div className="flex mt-1">{renderStars(review.rating)}</div>
                </div>
              </div>

              {review.title && <h4 className="font-medium mt-4 mb-2">{review.title}</h4>}

              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Star className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">
            You haven't written any reviews yet. Share your thoughts on products you've purchased!
          </p>
        </div>
      )}
    </div>
  )
}
