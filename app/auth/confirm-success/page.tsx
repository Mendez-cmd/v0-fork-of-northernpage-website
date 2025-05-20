"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ConfirmSuccessPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: "Email confirmed",
      description: "Your email has been successfully verified.",
      duration: 5000,
    })
  }, [toast])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Email Confirmed!</h1>
        <p className="text-gray-600">
          Your email has been successfully verified. You can now access all features of Northern Chefs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/login")} variant="default">
            Log In
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
