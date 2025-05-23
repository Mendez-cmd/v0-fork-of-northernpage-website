"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createReview(formData: FormData) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("Authentication error:", authError)
    return { error: "Authentication error: " + authError.message }
  }

  if (!user) {
    console.error("No authenticated user found")
    return { error: "You must be logged in to submit a review" }
  }

  console.log("Authenticated user:", user.id)

  const productId = formData.get("product_id") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const images = formData.getAll("images") as string[]

  console.log("Review data received:", { productId, rating, title, content })

  if (!productId || !rating || !title) {
    return { error: "Missing required fields" }
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5" }
  }

  try {
    // Check if user already reviewed this product
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for existing review:", checkError)
      return { error: "Failed to check for existing review" }
    }

    if (existingReview) {
      return { error: "You have already reviewed this product" }
    }

    // Insert the review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        content,
        status: "approved", // Auto-approve for now
        helpful_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to submit review: " + error.message }
    }

    console.log("Review created successfully:", data)

    // Handle image uploads if any
    if (images && images.length > 0 && data) {
      const imageInserts = images.map((imageUrl, index) => ({
        review_id: data.id,
        image_url: imageUrl,
        display_order: index,
      }))

      const { error: imageError } = await supabase.from("review_images").insert(imageInserts)

      if (imageError) {
        console.error("Error saving review images:", imageError)
      }
    }

    // Revalidate the product page to show the new review
    revalidatePath(`/products/${productId}`)
    revalidatePath("/")
    revalidatePath("/admin/reviews")

    return { success: true, data }
  } catch (error: any) {
    console.error("Error creating review:", error)
    return { error: "An unexpected error occurred: " + error.message }
  }
}

export async function getReviewsByProductId(productId: string) {
  const supabase = createClient()

  try {
    // Get reviews with user info
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users!reviews_user_id_fkey (
          first_name,
          last_name
        )
      `)
      .eq("product_id", productId)
      .eq("status", "approved") // Only show approved reviews
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return []
    }

    // Get images for each review
    if (reviews && reviews.length > 0) {
      const reviewIds = reviews.map((review) => review.id)

      const { data: images, error: imagesError } = await supabase
        .from("review_images")
        .select("*")
        .in("review_id", reviewIds)
        .order("display_order", { ascending: true })

      if (imagesError) {
        console.error("Error fetching review images:", imagesError)
      } else if (images) {
        // Group images by review_id
        const imagesByReviewId = images.reduce(
          (acc, img) => {
            if (!acc[img.review_id]) {
              acc[img.review_id] = []
            }
            acc[img.review_id].push(img)
            return acc
          },
          {} as Record<string, any[]>,
        )

        // Add images to each review
        reviews.forEach((review) => {
          review.images = imagesByReviewId[review.id] || []
        })
      }

      // Get replies for each review
      const { data: replies, error: repliesError } = await supabase
        .from("review_replies")
        .select(`
          *,
          users!review_replies_user_id_fkey (
            first_name,
            last_name,
            role
          )
        `)
        .in("review_id", reviewIds)
        .order("created_at", { ascending: true })

      if (repliesError) {
        console.error("Error fetching review replies:", repliesError)
      } else if (replies) {
        // Group replies by review_id
        const repliesByReviewId = replies.reduce(
          (acc, reply) => {
            if (!acc[reply.review_id]) {
              acc[reply.review_id] = []
            }
            acc[reply.review_id].push(reply)
            return acc
          },
          {} as Record<string, any[]>,
        )

        // Add replies to each review
        reviews.forEach((review) => {
          review.replies = repliesByReviewId[review.id] || []
        })
      }
    }

    return reviews || []
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

export async function getProductRatingStats(productId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("status", "approved")

    if (error || !data) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }

    const totalReviews = data.length
    const averageRating = totalReviews > 0 ? data.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

    const ratingDistribution = data.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc] = (acc[review.rating as keyof typeof acc] || 0) + 1
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    )

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    }
  } catch (error) {
    console.error("Error fetching rating stats:", error)
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }
}

export async function deleteReview(reviewId: string) {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in" }
  }

  try {
    // Check if the review belongs to the user or if user is admin
    const { data: review } = await supabase.from("reviews").select("user_id, product_id").eq("id", reviewId).single()

    if (!review) {
      return { error: "Review not found" }
    }

    // Get user role
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    const isAdmin = userData?.role === "admin"
    const isOwner = review.user_id === user.id

    if (!isAdmin && !isOwner) {
      return { error: "You can only delete your own reviews" }
    }

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

    if (error) {
      return { error: "Failed to delete review" }
    }

    // Revalidate pages
    revalidatePath(`/products/${review.product_id}`)
    revalidatePath("/admin/reviews")

    return { success: true }
  } catch (error) {
    console.error("Error deleting review:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function markReviewHelpful(reviewId: string, isHelpful: boolean) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to mark a review as helpful" }
  }

  try {
    // Check if user already marked this review
    const { data: existingVote } = await supabase
      .from("review_helpfulness")
      .select("id, is_helpful")
      .eq("review_id", reviewId)
      .eq("user_id", user.id)
      .single()

    if (existingVote) {
      // Update existing vote if it's different
      if (existingVote.is_helpful !== isHelpful) {
        const { error: updateError } = await supabase
          .from("review_helpfulness")
          .update({ is_helpful: isHelpful })
          .eq("id", existingVote.id)

        if (updateError) {
          return { error: "Failed to update helpfulness vote" }
        }
      } else {
        // Remove the vote if clicking the same button again
        const { error: deleteError } = await supabase.from("review_helpfulness").delete().eq("id", existingVote.id)

        if (deleteError) {
          return { error: "Failed to remove helpfulness vote" }
        }
      }
    } else {
      // Insert new vote
      const { error: insertError } = await supabase.from("review_helpfulness").insert({
        review_id: reviewId,
        user_id: user.id,
        is_helpful: isHelpful,
      })

      if (insertError) {
        return { error: "Failed to mark review as helpful" }
      }
    }

    // Update the helpful_count in the reviews table
    const { data: helpfulCount } = await supabase
      .from("review_helpfulness")
      .select("id")
      .eq("review_id", reviewId)
      .eq("is_helpful", true)

    const { error: updateError } = await supabase
      .from("reviews")
      .update({ helpful_count: helpfulCount?.length || 0 })
      .eq("id", reviewId)

    if (updateError) {
      console.error("Error updating helpful count:", updateError)
    }

    // Get the product_id to revalidate the page
    const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).single()

    if (review) {
      revalidatePath(`/products/${review.product_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error marking review as helpful:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function addReviewReply(reviewId: string, content: string, isBusinessReply = false) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to reply to a review" }
  }

  // Check if user is allowed to add a business reply
  if (isBusinessReply) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userData || userData.role !== "admin") {
      return { error: "Only administrators can add business replies" }
    }
  }

  try {
    const { data, error } = await supabase
      .from("review_replies")
      .insert({
        review_id: reviewId,
        user_id: user.id,
        content,
        is_business_reply: isBusinessReply,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding reply:", error)
      return { error: "Failed to add reply" }
    }

    // Get the product_id to revalidate the page
    const { data: review } = await supabase.from("reviews").select("product_id").eq("id", reviewId).single()

    if (review) {
      revalidatePath(`/products/${review.product_id}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error adding reply:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function flagReview(reviewId: string, reason: string, description: string) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to flag a review" }
  }

  try {
    // Check if user already flagged this review
    const { data: existingFlag } = await supabase
      .from("review_flags")
      .select("id")
      .eq("review_id", reviewId)
      .eq("user_id", user.id)
      .single()

    if (existingFlag) {
      return { error: "You have already flagged this review" }
    }

    const { data, error } = await supabase
      .from("review_flags")
      .insert({
        review_id: reviewId,
        user_id: user.id,
        reason,
        description,
      })
      .select()
      .single()

    if (error) {
      console.error("Error flagging review:", error)
      return { error: "Failed to flag review" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error flagging review:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function moderateReview(reviewId: string, status: "approved" | "rejected") {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "You must be logged in to moderate reviews" }
  }

  // Check if user is an admin
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    return { error: "Only administrators can moderate reviews" }
  }

  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: user.id,
      })
      .eq("id", reviewId)
      .select()
      .single()

    if (error) {
      console.error("Error moderating review:", error)
      return { error: "Failed to moderate review" }
    }

    // Update flags status if any
    await supabase
      .from("review_flags")
      .update({ status: status === "rejected" ? "resolved" : "dismissed" })
      .eq("review_id", reviewId)
      .eq("status", "pending")

    // Revalidate pages
    revalidatePath(`/products/${data.product_id}`)
    revalidatePath("/admin/reviews")

    return { success: true, data }
  } catch (error) {
    console.error("Error moderating review:", error)
    return { error: "An unexpected error occurred" }
  }
}
