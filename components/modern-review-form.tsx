"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Upload, X, MessageSquare, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { createReview } from "@/app/actions/reviews"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface ModernReviewFormProps {
  products?: Array<{ id: string; name: string; image_url?: string }>
  selectedProductId?: string
  onReviewSubmitted?: () => void
  className?: string
}

export function ModernReviewForm({
  products = [],
  selectedProductId,
  onReviewSubmitted,
  className = "",
}: ModernReviewFormProps) {
  const [selectedProduct, setSelectedProduct] = useState(selectedProductId || "")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles = [...images, ...files].slice(0, 3)
    setImages(newFiles)
    setUploadError(null)

    if (files.length > 0) {
      setIsUploading(true)
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

        if (bucketsError) {
          console.error("Error listing buckets:", bucketsError)
          setUploadError("Unable to access storage. Images will not be uploaded.")
          setIsUploading(false)
          return
        }

        const availableBucket = buckets && buckets.length > 0 ? buckets[0].name : null

        if (!availableBucket) {
          setUploadError("No storage buckets available. Images will not be uploaded.")
          setIsUploading(false)
          return
        }

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
    setImages((prev) => prev.filter((_, i) => i !== index))
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

    if (!selectedProduct) {
      toast({
        title: "Product required",
        description: "Please select a product to review.",
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
      formData.append("product_id", selectedProduct)
      formData.append("rating", rating.toString())
      formData.append("title", title)
      formData.append("content", content)

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
        title: "Review submitted! ✨",
        description: "Thank you for your feedback. Your review helps others discover great products!",
      })

      // Reset form
      setSelectedProduct(selectedProductId || "")
      setRating(0)
      setTitle("")
      setContent("")
      setImages([])
      setUploadedImageUrls([])
      setUploadError(null)
      setShowForm(false)
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

  const resetForm = () => {
    setSelectedProduct(selectedProductId || "")
    setRating(0)
    setTitle("")
    setContent("")
    setImages([])
    setUploadedImageUrls([])
    setUploadError(null)
    setShowForm(false)
  }

  if (!user) {
    return (
      <div className={`${className}`}>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
            <p className="text-gray-600 mb-6">
              Please log in to write a review and help others discover great products.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <a href="/login">Log In to Review</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <AnimatePresence>
        {!showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Share Your Experience</h3>
                <p className="text-gray-600 mb-6">
                  Tell others about your experience with our products. Your review matters!
                </p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Write Your Review</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={resetForm} className="text-white hover:bg-white/20">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {/* Product Selection */}
                {products.length > 0 && !selectedProductId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Select Product *</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger className="border-2 border-gray-200 focus:border-amber-400 transition-colors">
                        <SelectValue placeholder="Choose a product to review" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Your Rating *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Star
                          className={`h-8 w-8 transition-all duration-200 ${
                            star <= (hoveredRating || rating)
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "text-gray-300 hover:text-amber-200"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-amber-600 font-medium"
                    >
                      {rating === 5
                        ? "Excellent!"
                        : rating === 4
                          ? "Very Good!"
                          : rating === 3
                            ? "Good!"
                            : rating === 2
                              ? "Fair"
                              : "Poor"}
                    </motion.p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="review-title" className="text-sm font-semibold text-gray-700">
                    Review Title *
                  </Label>
                  <Input
                    id="review-title"
                    placeholder="Summarize your experience in a few words"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    className="border-2 border-gray-200 focus:border-amber-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500">{title.length}/255 characters</p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="review-content" className="text-sm font-semibold text-gray-700">
                    Your Review
                  </Label>
                  <Textarea
                    id="review-content"
                    placeholder="Tell others about your experience with this product. What did you like? How was the quality? Would you recommend it?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="border-2 border-gray-200 focus:border-amber-400 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500">{content.length}/1000 characters</p>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Add Photos (Optional)</Label>
                  {uploadError && (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      {uploadError}
                    </div>
                  )}
                  <div>
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
                      className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        images.length >= 3 || isUploading
                          ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                          : "border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Upload className="h-6 w-6" />
                      <div className="text-center">
                        <p className="font-medium">
                          {isUploading ? "Uploading..." : images.length >= 3 ? "Maximum 3 images" : "Upload Images"}
                        </p>
                        <p className="text-sm opacity-75">{images.length}/3 • PNG, JPG up to 10MB</p>
                      </div>
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="flex gap-3">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitReview}
                    disabled={
                      isSubmitting ||
                      isUploading ||
                      rating === 0 ||
                      !title.trim() ||
                      (!selectedProductId && !selectedProduct)
                    }
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Submit Review
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
