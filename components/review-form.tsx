"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Upload, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { createReview } from "@/app/actions/reviews"
import { createClient } from "@/lib/supabase/client"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 3 images total
    const newFiles = [...images, ...files].slice(0, 3)
    setImages(newFiles)
    setUploadError(null)

    // Try to upload images to Supabase Storage
    if (files.length > 0) {
      setIsUploading(true)
      try {
        // First check if we can access storage buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

        if (bucketsError) {
          console.error("Error listing buckets:", bucketsError)
          setUploadError("Unable to access storage. Images will not be uploaded.")
          setIsUploading(false)
          return
        }

        // Find an available bucket
        const availableBucket = buckets && buckets.length > 0 ? buckets[0].name : null

        if (!availableBucket) {
          setUploadError("No storage buckets available. Images will not be uploaded.")
          setIsUploading(false)
          return
        }

        // Use the first available bucket
        for (const file of files) {
          if (uploadedImageUrls.length + images.length >= 3) break

          const fileName = `reviews/${user?.id || "anonymous"}/${Date.now()}-${file.name}`
          const { data, error } = await supabase.storage.from(availableBucket).upload(fileName, file)

          if (error) {
            console.error("Error uploading image:", error)
            setUploadError(`Upload failed: ${error.message}. You can still submit your review without images.`)
          } else if (data) {
            const { data: urlData } = supabase.storage.from(availableBucket).getPublicUrl(data.path)
            setUploadedImageUrls((prev) => [...prev, urlData.publicUrl])
          }
        }
      } catch (error) {
        console.error("Error in image upload:", error)
        setUploadError("An error occurred during image upload. You can still submit your review without images.")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const removeImage = (index: number) => {
    // Remove from local state
    setImages((prev) => prev.filter((_, i) => i !== index))

    // Remove from uploaded URLs if exists
    if (index < uploadedImageUrls.length) {
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index))
    }
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

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your review.",
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

      // Add uploaded image URLs if any
      if (uploadedImageUrls.length > 0) {
        uploadedImageUrls.forEach((url) => {
          formData.append("images", url)
        })
      }

      const result = await createReview(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      })

      // Reset form
      setRating(0)
      setTitle("")
      setContent("")
      setImages([])
      setUploadedImageUrls([])
      setUploadError(null)
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

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please log in to write a review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div>
          <Label>Rating *</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 hover:text-amber-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="review-title">Review Title *</Label>
          <Input
            id="review-title"
            placeholder="Summarize your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
          />
        </div>

        {/* Content */}
        <div>
          <Label htmlFor="review-content">Your Review</Label>
          <Textarea
            id="review-content"
            placeholder="Tell others about your experience with this product"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <p className="text-sm text-gray-500 mt-1">{content.length}/1000 characters</p>
        </div>

        {/* Image Upload */}
        <div>
          <Label>Add Photos (Optional)</Label>
          {uploadError && <div className="text-sm text-amber-600 mt-1 mb-2">{uploadError}</div>}
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="review-images"
              disabled={images.length >= 3 || isUploading}
            />
            <Label
              htmlFor="review-images"
              className={`flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                images.length >= 3 || isUploading
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Upload className="h-5 w-5" />
              {isUploading
                ? "Uploading..."
                : images.length >= 3
                  ? "Maximum 3 images"
                  : `Upload Images (${images.length}/3)`}
            </Label>
          </div>

          {images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image) || "/placeholder.svg"}
                    alt={`Review image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={submitReview}
          disabled={isSubmitting || isUploading || rating === 0 || !title.trim()}
          className="w-full bg-gold hover:bg-amber-500 text-black"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </CardContent>
    </Card>
  )
}
