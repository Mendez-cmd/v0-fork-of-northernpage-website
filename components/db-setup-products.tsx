"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function DbSetupProducts() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const setupDatabase = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      // First create the function
      const functionRes = await fetch("/api/create-products-function")
      if (!functionRes.ok) {
        throw new Error("Failed to create function")
      }

      // Then set up the products table
      const tableRes = await fetch("/api/setup-products-table")
      const data = await tableRes.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to set up products table")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-8 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Products Database Setup</h2>
      <p className="mb-4 text-gray-600">
        Set up the products table in your Supabase database and populate it with sample data.
      </p>

      {status === "success" && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{message}</AlertDescription>
        </Alert>
      )}

      <Button onClick={setupDatabase} disabled={isLoading} className="bg-gold hover:bg-amber-600 text-black">
        {isLoading ? "Setting up..." : "Set Up Products Database"}
      </Button>
    </div>
  )
}
