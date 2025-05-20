"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get token_hash and type from URL
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token_hash || type !== "email") {
          setStatus("error")
          setErrorMessage("Invalid confirmation link. Please request a new one.")
          return
        }

        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: "email",
        })

        if (error) {
          console.error("Verification error:", error)
          setStatus("error")
          setErrorMessage(error.message || "Failed to verify email. Please try again.")
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: error.message || "Failed to verify email. Please try again.",
          })
        } else {
          setStatus("success")
          toast({
            title: "Email Verified",
            description: "Your email has been successfully verified. You can now log in.",
          })
        }
      } catch (error) {
        console.error("Unexpected error during verification:", error)
        setStatus("error")
        setErrorMessage("An unexpected error occurred. Please try again.")
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: "An unexpected error occurred. Please try again.",
        })
      }
    }

    confirmEmail()
  }, [searchParams, toast, supabase, router])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Verifying your email address..."
              : status === "success"
                ? "Your email has been verified"
                : "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="text-center">Please wait while we verify your email address...</p>
            </div>
          ) : status === "success" ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">
                Thank you for confirming your email address. Your account is now fully activated.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <p className="text-center font-medium text-red-600">{errorMessage}</p>
              <div className="bg-red-50 border border-red-200 rounded-md p-4 w-full">
                <p className="text-sm text-red-700">
                  This could be due to an expired or invalid confirmation link. Please try logging in or request a new
                  confirmation email.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {status === "loading" ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </Button>
          ) : status === "success" ? (
            <>
              <Button asChild className="w-full">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link href="/login">Return to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Sign Up Again</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
