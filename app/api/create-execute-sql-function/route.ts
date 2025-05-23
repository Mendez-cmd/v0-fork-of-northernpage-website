import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create the execute_sql function if it doesn't exist
    const { error } = await supabase.rpc("execute_sql", {
      query_text: "SELECT 1",
    })

    if (error && error.message.includes("function") && error.message.includes("does not exist")) {
      // Function doesn't exist, create it
      const { error: createError } = await supabase.auth.admin.executeRaw(`
        CREATE OR REPLACE FUNCTION execute_sql(query_text TEXT)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE query_text INTO result;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          RETURN jsonb_build_object('error', SQLERRM);
        END;
        $$;
      `)

      if (createError) {
        throw createError
      }

      return NextResponse.json({ success: true, message: "execute_sql function created" })
    }

    return NextResponse.json({ success: true, message: "execute_sql function already exists" })
  } catch (error: any) {
    console.error("Error creating execute_sql function:", error)
    return NextResponse.json({ error: error.message || "Failed to create execute_sql function" }, { status: 500 })
  }
}
