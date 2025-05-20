import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Use the correct method for SQL queries
    const { data: columnCheck, error: checkError } = await supabase.from("users").select("*").limit(0)

    // If we can query the users table, try to add the column
    const { error: alterError } = await supabase.rpc("execute_sql", {
      sql_query: `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS profile_picture TEXT;
      `,
    })

    if (alterError) {
      console.error("Error adding profile_picture column:", alterError)

      // Try a different approach if the RPC fails
      try {
        // Try to update a user to see if the column exists
        const { error: updateError } = await supabase
          .from("users")
          .update({ profile_picture: null })
          .eq("id", "test-id")
          .select()

        if (updateError && !updateError.message.includes("profile_picture")) {
          // If the error is not about the profile_picture column, the column might exist
          return NextResponse.json({ success: true, message: "Profile picture column might already exist" })
        }
      } catch (e) {
        console.error("Error in fallback check:", e)
      }

      return NextResponse.json({ error: alterError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Profile picture column added or already exists" })
  } catch (error) {
    console.error("Error in add-profile-picture-column route:", error)

    // Fallback approach - just try to update the user metadata without the column
    try {
      return NextResponse.json({
        success: true,
        message: "Skipping database column, will use auth metadata only for profile pictures",
        fallback: true,
      })
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}
