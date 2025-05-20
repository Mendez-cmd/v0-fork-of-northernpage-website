import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if the execute_sql function exists
    const { data: functionExists, error: functionCheckError } = await supabase
      .from("pg_proc")
      .select("proname")
      .eq("proname", "execute_sql")
      .maybeSingle()

    // If the function doesn't exist, create it
    if (functionCheckError || !functionExists) {
      console.log("Creating execute_sql function...")

      // Create the execute_sql function using raw SQL
      const { error: createFunctionError } = await supabase.auth.admin.executeRaw(`
        CREATE OR REPLACE FUNCTION execute_sql(sql_query text)
        RETURNS void AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `)

      if (createFunctionError) {
        console.error("Error creating execute_sql function:", createFunctionError)
        return NextResponse.json({ error: "Failed to create execute_sql function" }, { status: 500 })
      }
    }

    // Now use the function to run our migrations
    const migrations = [
      // Add profile_picture column to users table if it doesn't exist
      `DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'users' 
          AND column_name = 'profile_picture'
        ) THEN
          ALTER TABLE users ADD COLUMN profile_picture TEXT;
        END IF;
      END $$;`,

      // Create profile_pictures storage bucket if it doesn't exist
      `SELECT create_storage_bucket('profile-pictures', 'Profile Pictures', 'public');`,

      // Add storage policy to allow authenticated users to upload profile pictures
      `BEGIN;
      INSERT INTO storage.policies (name, definition, bucket_id)
      SELECT 
        'Allow authenticated users to upload profile pictures',
        '(auth.role() = ''authenticated'')',
        id
      FROM storage.buckets
      WHERE name = 'profile-pictures'
      ON CONFLICT (name, bucket_id) DO NOTHING;
      COMMIT;`,
    ]

    // Execute each migration
    for (const migration of migrations) {
      try {
        await supabase.rpc("execute_sql", { sql_query: migration })
      } catch (error) {
        console.error("Error executing migration:", error)
        // Continue with other migrations even if one fails
      }
    }

    // Verify the profile_picture column exists
    const { data: columnExists, error: columnCheckError } = await supabase.auth.admin.executeRaw(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'profile_picture'
    `)

    if (columnCheckError) {
      console.error("Error checking if profile_picture column exists:", columnCheckError)
      return NextResponse.json({ error: "Failed to verify profile_picture column" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Database migrations completed successfully",
      columnExists: !!columnExists && columnExists.length > 0,
    })
  } catch (error) {
    console.error("Error in db-migrations route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
