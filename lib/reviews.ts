import { createClient } from "@/lib/supabase/server"

// Fallback reviews data when database is not set up
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
    users: {
      first_name: "Ana",
      last_name: "Reyes",
    },
    products: {
      name: "Laing",
    },
  },
]

// Helper function to check if a table exists
async function tableExists(supabase: any, tableName: string): Promise<boolean> {
  try {
    // Simple query to check if the table exists
    const { error } = await supabase.from(tableName).select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

export async function getReviews() {
  const supabase = createClient()

  // Just return fallback data for now until database is set up
  return fallbackReviews
}

export async function getReviewsByProductId(productId: string) {
  // Just return filtered fallback data for now
  return fallbackReviews.filter((r) => r.product_id === productId)
}

export async function getReviewsByUserId(userId: string) {
  // Just return filtered fallback data for now
  return fallbackReviews.filter((r) => r.user_id === userId)
}

export async function createReview(review: {
  product_id: string
  user_id: string
  rating: number
  title: string
  content: string
}) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("reviews").insert([review]).select()

    if (error) {
      console.error("Error creating review:", error)
      return null
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Exception creating review:", error)
    return null
  }
}
