import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Create function to check if a column exists
    const { error } = await supabase.query(`
      CREATE OR REPLACE FUNCTION column_exists(table_name text, column_name text)
      RETURNS boolean AS $$
      DECLARE
        exists boolean;
      BEGIN
        SELECT COUNT(*) > 0 INTO exists
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2;
        
        RETURN exists;
      END;
      $$ LANGUAGE plpgsql;
    `)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, message: "Column exists function created successfully" })
  } catch (error) {
    console.error("Error creating column exists function:", error)
    return NextResponse.json({ success: false, error: "Failed to create column exists function" }, { status: 500 })
  }
}
