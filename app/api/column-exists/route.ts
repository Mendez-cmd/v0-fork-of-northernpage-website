import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { table, column } = await request.json()

  if (!table || !column) {
    return NextResponse.json({ error: "Table and column names are required" }, { status: 400 })
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Use raw SQL query to check if column exists
    const { data, error } = await supabase.rpc("execute_sql", {
      query_text: `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = '${table}'
          AND column_name = '${column}'
        ) as column_exists;
      `,
    })

    if (error) {
      // If RPC fails, try direct SQL query
      const { data: directData, error: directError } = await supabase
        .from("users")
        .select(`${column}`)
        .limit(1)
        .maybeSingle()

      if (directError && directError.message.includes("column") && directError.message.includes("does not exist")) {
        // Column doesn't exist
        return NextResponse.json({ exists: false })
      } else if (!directError) {
        // Query succeeded, column exists
        return NextResponse.json({ exists: true })
      }

      throw error
    }

    return NextResponse.json({
      exists: data && data.length > 0 && data[0].column_exists,
    })
  } catch (error: any) {
    console.error("Column check error:", error)

    // Fallback: If we can't check properly, assume column doesn't exist
    return NextResponse.json({ exists: false })
  }
}
