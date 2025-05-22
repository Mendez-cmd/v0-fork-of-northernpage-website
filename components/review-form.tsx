"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files].slice(0, 3)) // Max 3 images
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      // Upload images if any
      const imageUrls: string[] = []
      if (images.length > 0) {
        for (const image of images) {
          const fileName = `${Date.now()}-${image.name}`
          const { data, error } = await supabase.storage.from("review-images").upload(fileName, image)

          if (!error && data) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("review-images").getPublicUrl(fileName)
            imageUrls.push(publicUrl)
          }
        }
      }

      // Submit review
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        comment,
        images: imageUrls,
        verified_purchase: true, // You might want to check this based on actual purchases
      })

      if (error) throw error

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      })

      // Reset form
      setRating(0)
      setTitle("")
      setComment("")
      setImages([])
      onReviewSubmitted?.()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div>
          <Label>Rating</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="review-title">Review Title</Label>
          <Input
            id="review-title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Comment */}
        <div>
          <Label htmlFor="review-comment">Your Review</Label>
          <Textarea
            id="review-comment"
            placeholder="Tell others about your experience with this product"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Add Photos (Optional)</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="review-images"
            />
            <Label
              htmlFor="review-images"
              className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
            >
              <Upload className="h-5 w-5" />
              Upload Images (Max 3)
            </Label>
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Review image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={submitReview}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-gold hover:bg-amber-500 text-black"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  )
}
