"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function DbSetupNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkDatabaseSetup = async () => {
      try {
        // Try to query the products table directly
        const { data, error } = await supabase.from("products").select("id").limit(1)

        // If there's an error, the products table doesn't exist
        setShowNotification(!!error)
      } catch (err) {
        // If there's an exception, assume the table doesn't exist
        setShowNotification(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabaseSetup()
  }, [supabase])

  if (isLoading || !showNotification) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Database Setup Required</AlertTitle>
        <AlertDescription className="text-amber-700">
          <p className="mb-2">
            Your database tables haven't been set up yet. The site is currently using fallback data.
          </p>
          <div className="flex justify-between items-center">
            <Link href="/admin/setup">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                Set Up Database
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-800 hover:bg-amber-200"
              onClick={() => setShowNotification(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
