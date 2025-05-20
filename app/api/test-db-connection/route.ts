import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Test the connection by querying the products table
    const { data, error } = await supabase.from("products").select("count").single()

    if (error) {
      console.error("Database connection test failed:", error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data,
    })
  } catch (error) {
    console.error("Exception in database connection test:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
