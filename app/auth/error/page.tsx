"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("message") || "An authentication error occurred"
  const { toast } = useToast()

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: errorMessage,
      duration: 5000,
    })
  }, [errorMessage, toast])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md text-center space-y-6">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-gray-600">{errorMessage}</p>
        <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/login")} variant="default">
            Return to Login
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
