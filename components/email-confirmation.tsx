"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function EmailConfirmation() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      const code = searchParams.get("code")

      if (!code) {
        setStatus("error")
        setErrorMessage("No confirmation code found in the URL.")
        return
      }

      try {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          setStatus("error")
          setErrorMessage(error.message)
          toast({
            variant: "destructive",
            title: "Email confirmation failed",
            description: error.message,
          })
        } else {
          setStatus("success")
          toast({
            title: "Email confirmed",
            description: "Your email has been confirmed successfully.",
          })
        }
      } catch (err) {
        console.error("Email confirmation error:", err)
        setStatus("error")
        setErrorMessage("An unexpected error occurred. Please try again.")
      }
    }

    confirmEmail()
  }, [searchParams, toast, supabase.auth])

  const handleContinue = () => {
    router.push("/")
  }

  const handleRetry = () => {
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Confirmation</CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Verifying your email address..."}
            {status === "success" && "Your email has been confirmed!"}
            {status === "error" && "Email confirmation failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && <Loader2 className="h-16 w-16 text-gold animate-spin" />}
          {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}

          {status === "error" && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}

          {status === "success" && (
            <p className="mt-4 text-center">
              Thank you for confirming your email address. You can now access all features of your Northern Chefs
              account.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "loading" && <p className="text-sm text-gray-500">This may take a few moments...</p>}
          {status === "success" && (
            <Button onClick={handleContinue} className="bg-gold hover:bg-amber-600 text-black">
              Continue to Homepage
            </Button>
          )}
          {status === "error" && (
            <Button onClick={handleRetry} variant="outline">
              Return to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
