"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2, Eye } from "lucide-react"
import { getReviews } from "@/lib/reviews"
import { deleteReview } from "@/app/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string
  content: string | null
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  users: {
    first_name: string | null
    last_name: string | null
  } | null
  products: {
    name: string
  } | null
}

export function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const data = await getReviews()
      setReviews(data as Review[])
    } catch (error) {
      console.error("Error loading reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }

    try {
      const result = await deleteReview(reviewId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Review deleted successfully",
      })

      // Reload reviews
      loadReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading reviews...</div>
  }

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No reviews found</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.title}</span>
                  {review.verified_purchase && (
                    <Badge variant="secondary" className="text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-2">{review.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    By: {review.users?.first_name} {review.users?.last_name}
                  </span>
                  <span>Product: {review.products?.name}</span>
                  <span>{formatDate(review.created_at)}</span>
                  <span>{review.helpful_count} helpful votes</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/products/${review.product_id}`, "_blank")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
