"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createReview } from "@/app/actions/reviews"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  price: number
  description?: string
}

interface HomeReviewFormProps {
  products: Product[]
}

export function HomeReviewForm({ products }: HomeReviewFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [productId, setProductId] = useState(products.length > 0 ? products[0].id : "")

  // Simplified authentication check
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Simplified user check that doesn't rely on server-side functions
  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    const getUser = async () => {
      try {
        if (!isMounted) return
        setLoading(true)

        // Simple session check
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (!isMounted) return

        if (sessionError || !session) {
          setUser(null)
          setLoading(false)
          return
        }

        // Set basic user info from session
        setUser({
          id: session.user.id,
          email: session.user.email,
          first_name: session.user.user_metadata?.first_name || "User",
          last_name: session.user.user_metadata?.last_name || "",
        })
      } catch (error) {
        console.error("Authentication error:", error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          first_name: session.user.user_metadata?.first_name || "User",
          last_name: session.user.user_metadata?.last_name || "",
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You need to be signed in to submit a review. Please sign in and try again.",
        variant: "destructive",
      })
      router.push("/login?redirect=/")
      return
    }

    if (!productId) {
      toast({
        title: "Please select a product",
        description: "You need to select a product to review.",
        variant: "destructive",
      })
      return
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and review content.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("product_id", productId)
      formData.append("rating", rating.toString())
      formData.append("title", title)
      formData.append("content", content)

      const result = await createReview(formData)

      if (result.success) {
        toast({
          title: "Review submitted!",
          description: "Thank you for your feedback.",
        })

        // Reset form
        setRating(5)
        setTitle("")
        setContent("")

        // Refresh the page to show the new review
        router.refresh()
      } else {
        throw new Error(result.error || "Failed to submit review")
      }
    } catch (error: any) {
      console.error("Review submission error:", error)
      toast({
        title: "Error submitting review",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
        <p className="text-gray-600">No products available for review at the moment.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Add Your Review</h3>

      {/* Simplified authentication status */}
      {loading ? (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-4">Checking authentication...</div>
      ) : user ? (
        <div className="bg-green-50 p-3 rounded-md text-sm text-green-800 mb-4">
          Signed in as: {user.first_name} {user.last_name}
        </div>
      ) : (
        <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 mb-4">
          Please{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-amber-800 underline"
            onClick={() => router.push("/login?redirect=/")}
          >
            sign in
          </Button>{" "}
          to submit a review.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="product">Product</Label>
          <Select value={productId} onValueChange={setProductId} disabled={isSubmitting || !user}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product to review" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - ₱{product.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Rating</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
                disabled={isSubmitting || !user}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating ? "fill-gold text-gold" : "fill-gray-200 text-gray-200"
                  } ${!user && "opacity-50"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="review-title">Title</Label>
          <Input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title"
            required
            disabled={isSubmitting || !user}
          />
        </div>

        <div>
          <Label htmlFor="review-content">Review</Label>
          <Textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write your review..."
            required
            disabled={isSubmitting || !user}
          />
        </div>

        <Button type="submit" className="w-full bg-gold hover:bg-amber-500 text-black" disabled={isSubmitting || !user}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  )
}
