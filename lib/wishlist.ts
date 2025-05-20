import { createClient } from "@/lib/supabase/client"

export async function addToWishlist(userId: string, productId: string) {
  const supabase = createClient()

  try {
    // Check if the item is already in the wishlist
    const { data: existing, error: checkError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle()

    if (checkError) {
      // If the table doesn't exist or there's another error, handle it
      if (checkError.message.includes("does not exist")) {
        console.log("Wishlist table does not exist yet")
        return { success: false, message: "Wishlist feature not available yet" }
      }
      throw checkError
    }

    // If the item is already in the wishlist, return early
    if (existing) {
      return { success: true, message: "Item is already in your wishlist" }
    }

    // Add the item to the wishlist
    const { error } = await supabase.from("wishlist").insert([{ user_id: userId, product_id: productId }])

    if (error) throw error

    return { success: true, message: "Item added to wishlist" }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { success: false, message: "Failed to add item to wishlist" }
  }
}

export async function removeFromWishlist(wishlistId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("wishlist").delete().eq("id", wishlistId)

    if (error) throw error

    return { success: true, message: "Item removed from wishlist" }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, message: "Failed to remove item from wishlist" }
  }
}

export async function isInWishlist(userId: string, productId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle()

    if (error) {
      // If the table doesn't exist, return false
      if (error.message.includes("does not exist")) {
        return false
      }
      throw error
    }

    return !!data
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return false
  }
}
