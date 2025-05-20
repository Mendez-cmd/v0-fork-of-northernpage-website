"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export default function FixDatabasePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const runMigrations = async () => {
    setIsRunning(true)
    try {
      const response = await fetch("/api/db-migrations")
      const data = await response.json()

      setResults(data)

      if (data.success) {
        toast({
          title: "Success",
          description: "Database migrations completed successfully",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to run database migrations",
        })
      }
    } catch (error) {
      console.error("Error running migrations:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fix Database</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Pictures Database Fix</h2>
        <p className="mb-4">This will run migrations to fix the database for profile pictures:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Add profile_picture column to users table</li>
          <li>Create profile-pictures storage bucket</li>
          <li>Add storage policies for profile pictures</li>
        </ul>

        <Button onClick={runMigrations} disabled={isRunning} className="bg-gold hover:bg-amber-500 text-black">
          {isRunning ? "Running..." : "Run Database Migrations"}
        </Button>
      </div>

      {results && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
