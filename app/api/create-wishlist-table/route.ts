import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create the stored procedure if it doesn't exist
    await supabase.rpc("create_wishlist_function", {})

    // Execute the stored procedure to create the wishlist table
    const { error } = await supabase.rpc("create_wishlist_table")

    if (error) throw error

    return NextResponse.json({ success: true, message: "Wishlist table created successfully" })
  } catch (error) {
    console.error("Error creating wishlist table:", error)
    return NextResponse.json({ success: false, message: "Failed to create wishlist table" }, { status: 500 })
  }
}
