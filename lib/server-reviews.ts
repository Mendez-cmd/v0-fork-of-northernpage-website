// This file contains server-side review functions
import { createClient } from "@/lib/supabase/server"

// Server-side function to get reviews
export async function getServerReviews() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users!reviews_user_id_fkey (
          first_name,
          last_name
        ),
        products (
          name
        )
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error("Error fetching reviews:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Exception fetching reviews:", error)
    return []
  }
}

// Server-side function to get reviews by product ID
export async function getServerReviewsByProductId(productId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users!reviews_user_id_fkey (
          first_name,
          last_name
        )
      `)
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching product reviews:", error)
      return []
    }

    // Get images for each review
    if (data && data.length > 0) {
      const reviewIds = data.map((review) => review.id)

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
        data.forEach((review) => {
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
        data.forEach((review) => {
          review.replies = repliesByReviewId[review.id] || []
        })
      }
    }

    return data || []
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return []
  }
}

// Server-side function to get product rating stats
export async function getServerProductRatingStats(productId: string) {
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
