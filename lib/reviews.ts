// This file should only use client-side code since it's imported by client components
import { createClient } from "@/lib/supabase/client"

// Fallback reviews data when database is not available
const fallbackReviews = [
  {
    id: "1",
    product_id: "1",
    user_id: "1",
    rating: 5,
    title: "Absolutely Delicious!",
    content:
      "The Chicken Pastil Original is amazing! The flavors are authentic and it reminds me of home. Will definitely order again!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: null,
    helpful_count: 0,
    status: "approved",
    users: {
      first_name: "Maria",
      last_name: "Santos",
    },
    products: {
      name: "Chicken Pastil Original",
    },
  },
  {
    id: "2",
    product_id: "5",
    user_id: "2",
    rating: 5,
    title: "Best Spanish Bangus Ever",
    content:
      "The Spanish Bangus is perfectly marinated and so flavorful. My family loved it and we'll be ordering more soon!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: null,
    helpful_count: 0,
    status: "approved",
    users: {
      first_name: "Juan",
      last_name: "Dela Cruz",
    },
    products: {
      name: "Spanish Bangus",
    },
  },
  {
    id: "3",
    product_id: "4",
    user_id: "3",
    rating: 4,
    title: "Authentic Laing",
    content: "The Laing tastes just like how my grandmother used to make it. Very authentic and delicious!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: null,
    helpful_count: 0,
    status: "approved",
    users: {
      first_name: "Ana",
      last_name: "Reyes",
    },
    products: {
      name: "Laing",
    },
  },
]

// Client-side function to get reviews
export async function getReviews() {
  try {
    const supabase = createClient()

    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 5000))

    const queryPromise = supabase
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
      .limit(3) // Further reduced limit

    const { data, error } = (await Promise.race([queryPromise, timeoutPromise])) as any

    if (error) {
      console.log("Database unavailable, using fallback reviews")
      return fallbackReviews
    }

    return data && data.length > 0 ? data : fallbackReviews
  } catch (error) {
    console.log("Database connection failed, using fallback reviews")
    return fallbackReviews
  }
}

// Client-side function to get reviews by product ID
export async function getReviewsByProductId(productId: string) {
  try {
    const supabase = createClient()

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 3000))

    const queryPromise = supabase
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
      .limit(5)

    const { data, error } = (await Promise.race([queryPromise, timeoutPromise])) as any

    if (error) {
      return fallbackReviews.filter((r) => r.product_id === productId)
    }

    return data && data.length > 0 ? data : fallbackReviews.filter((r) => r.product_id === productId)
  } catch (error) {
    return fallbackReviews.filter((r) => r.product_id === productId)
  }
}

// Client-side function to get reviews by user ID
export async function getReviewsByUserId(userId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products (
          name,
          image_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user reviews:", error)
      return fallbackReviews.filter((r) => r.user_id === userId)
    }

    return data || fallbackReviews.filter((r) => r.user_id === userId)
  } catch (error) {
    console.error("Exception fetching user reviews:", error)
    return fallbackReviews.filter((r) => r.user_id === userId)
  }
}

// Client-side function to get product rating stats
export async function getProductRatingStats(productId: string) {
  try {
    const supabase = createClient()

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
