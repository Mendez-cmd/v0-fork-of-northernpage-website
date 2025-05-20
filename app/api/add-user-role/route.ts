import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Check if role column exists
    const { data: columnExists, error: checkError } = await supabase.rpc("column_exists", {
      table_name: "users",
      column_name: "role",
    })

    if (checkError) {
      // Create the function if it doesn't exist
      await supabase.rpc("create_column_exists_function")

      // Try again
      const { data: retryColumnExists } = await supabase.rpc("column_exists", {
        table_name: "users",
        column_name: "role",
      })

      if (!retryColumnExists) {
        // Add role column to users table
        const { error: alterError } = await supabase.query(`
          ALTER TABLE users 
          ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'
        `)

        if (alterError) {
          throw alterError
        }
      }
    } else if (!columnExists) {
      // Add role column to users table
      const { error: alterError } = await supabase.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer'
      `)

      if (alterError) {
        throw alterError
      }
    }

    // Set the first user as admin
    const { error: updateError } = await supabase.query(`
      UPDATE users
      SET role = 'admin'
      WHERE id = (SELECT id FROM users ORDER BY created_at ASC LIMIT 1)
    `)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, message: "User roles added successfully" })
  } catch (error) {
    console.error("Error adding user roles:", error)
    return NextResponse.json({ success: false, error: "Failed to add user roles" }, { status: 500 })
  }
}
