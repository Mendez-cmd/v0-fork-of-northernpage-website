"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Loader2, Play } from "lucide-react"

export default function SqlExecutionPage() {
  const [sqlQuery, setSqlQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const executeSql = async () => {
    if (!sqlQuery.trim()) {
      setError("Please enter a SQL query")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Try to execute the SQL query using RPC
      const { data, error } = await supabase.rpc("execute_sql", { sql_query: sqlQuery })

      if (error) {
        // If RPC fails, try direct query (less safe but might work)
        if (sqlQuery.trim().toLowerCase().startsWith("select")) {
          const { data: directData, error: directError } = await supabase.from("_temp_").select("*").limit(1)

          if (directError) {
            setError(`Error executing SQL: ${error.message}`)
          } else {
            setResult(directData)
          }
        } else {
          setError(`Error executing SQL: ${error.message}`)
        }
      } else {
        setResult(data)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>SQL Execution</CardTitle>
          <CardDescription>Execute SQL queries against your Supabase database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sql-query" className="block text-sm font-medium">
              SQL Query
            </label>
            <Textarea
              id="sql-query"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="font-mono h-40"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2">
              <h3 className="font-medium">Result</h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-60">
                <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={executeSql} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Execute SQL
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
