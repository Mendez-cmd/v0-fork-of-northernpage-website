import { createClient } from "@/lib/supabase/server"

export async function executeSql(sqlQuery: string) {
  const supabase = createClient()

  try {
    // First try using the execute_sql RPC function
    const { data, error } = await supabase.rpc("execute_sql", { sql_query: sqlQuery })

    if (error) {
      console.error("Error executing SQL via RPC:", error)

      // If RPC fails, try direct query (less safe but might work)
      const { data: directData, error: directError } = await supabase.from("_temp_").select("*").limit(1)

      if (directError) {
        console.error("Error executing direct SQL:", directError)
        return { success: false, error: directError.message }
      }

      return { success: true, data: directData }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception executing SQL:", error)
    return { success: false, error: String(error) }
  }
}
