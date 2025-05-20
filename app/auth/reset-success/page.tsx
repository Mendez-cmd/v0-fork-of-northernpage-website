import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Reset - Northern Chefs",
  description: "Your password has been reset successfully",
}

export default function ResetSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">Your password has been reset successfully</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-4 text-center">
              Your password has been updated. You can now log in with your new password.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="bg-gold hover:bg-amber-600 text-black">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
