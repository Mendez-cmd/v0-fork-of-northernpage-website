"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { moderateReview } from "@/app/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

interface FlaggedReview {
  id: string
  review_id: string
  reason: string
  description: string | null
  status: string
  created_at: string
  reviews: {
    id: string
    product_id: string
    user_id: string
    rating: number
    title: string
    content: string | null
    status: string
    created_at: string
    users: {
      first_name: string | null
      last_name: string | null
    } | null
    products: {
      name: string
    } | null
  }
  users: {
    first_name: string | null
    last_name: string | null
  } | null
}

export function FlaggedReviewsList() {
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadFlaggedReviews()
  }, [])

  const loadFlaggedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("review_flags")
        .select(`
          *,
          reviews (
            *,
            users (
              first_name,
              last_name
            ),
            products (
              name
            )
          ),
          users (
            first_name,
            last_name
          )
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setFlaggedReviews(data as FlaggedReview[])
    } catch (error) {
      console.error("Error loading flagged reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load flagged reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModerateReview = async (reviewId: string, status: "approved" | "rejected") => {
    try {
      const result = await moderateReview(reviewId, status)

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
        description: `Review ${status === "approved" ? "approved" : "rejected"} successfully`,
      })

      // Reload flagged reviews
      loadFlaggedReviews()
    } catch (error) {
      console.error("Error moderating review:", error)
      toast({
        title: "Error",
        description: "Failed to moderate review",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading flagged reviews...</div>
  }

  if (flaggedReviews.length === 0) {
    return <p className="text-gray-500 text-center py-8">No flagged reviews found</p>
  }

  return (
    <div className="space-y-6">
      {flaggedReviews.map((flaggedReview) => (
        <Card key={flaggedReview.id} className="border-red-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge variant="destructive" className="mb-2">
                  Flagged: {flaggedReview.reason}
                </Badge>
                <div className="text-sm text-gray-600">
                  Flagged by: {flaggedReview.users?.first_name} {flaggedReview.users?.last_name} on{" "}
                  {formatDate(flaggedReview.created_at)}
                </div>
                {flaggedReview.description && (
                  <div className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Reason:</span> {flaggedReview.description}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleModerateReview(flaggedReview.reviews.id, "approved")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Approve</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleModerateReview(flaggedReview.reviews.id, "rejected")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  <span>Reject</span>
                </Button>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">
                  Review by: {flaggedReview.reviews.users?.first_name} {flaggedReview.reviews.users?.last_name}
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= flaggedReview.reviews.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                Product: <span className="font-medium">{flaggedReview.reviews.products?.name}</span>
              </div>

              <h4 className="font-medium">{flaggedReview.reviews.title}</h4>
              <p className="text-gray-700 mt-1">{flaggedReview.reviews.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
