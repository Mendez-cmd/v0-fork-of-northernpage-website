"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"

export default function SetupAdminPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const createAdminAccount = async () => {
    setIsCreating(true)

    try {
      // First, try to sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "nothrnchefs@gmail.com",
        password: "admin123!",
        options: {
          data: {
            first_name: "Admin",
            last_name: "User",
            role: "admin", // Set role in user metadata
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          // User already exists, try to sign in and update role
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: "nothrnchefs@gmail.com",
            password: "admin123!",
          })

          if (signInError) {
            throw new Error("Could not sign in with provided credentials. Please check the password.")
          }

          // Update user metadata with admin role
          await supabase.auth.updateUser({
            data: { role: "admin" },
          })

          toast({
            title: "Admin account updated",
            description: "The existing account has been updated with admin privileges.",
          })
        } else {
          throw signUpError
        }
      } else if (signUpData?.user) {
        // New user created, update metadata to ensure admin role
        await supabase.auth.updateUser({
          data: { role: "admin" },
        })

        // Try to insert basic user info without the role column
        try {
          const { error: insertError } = await supabase.from("users").insert({
            id: signUpData.user.id,
            email: "nothrnchefs@gmail.com",
            first_name: "Admin",
            last_name: "User",
          })

          if (insertError && !insertError.message.includes("duplicate key")) {
            console.error("Error inserting user:", insertError)
          }
        } catch (error) {
          console.error("Error inserting user:", error)
          // Continue anyway - the auth metadata is more important
        }

        toast({
          title: "Admin account created successfully!",
          description: "You can now log in with the admin credentials.",
        })
      }

      setIsCreated(true)
    } catch (error: any) {
      console.error("Error creating admin account:", error)
      toast({
        variant: "destructive",
        title: "Error creating admin account",
        description: error.message || "An unexpected error occurred.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>Create the admin account for Northern Chefs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCreated ? (
            <>
              <div className="space-y-2">
                <div className="text-sm font-medium">Admin Credentials:</div>
                <div className="bg-gray-100 p-3 rounded-md text-sm">
                  <div>
                    <strong>Email:</strong> nothrnchefs@gmail.com
                  </div>
                  <div>
                    <strong>Password:</strong> admin123!
                  </div>
                </div>
              </div>

              <Button
                onClick={createAdminAccount}
                disabled={isCreating}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                {isCreating ? "Creating Admin Account..." : "Create Admin Account"}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                This will create an admin account that can access the admin dashboard.
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">Admin Account Ready!</h3>
                <p className="text-sm text-gray-600 mt-2">You can now log in with the admin credentials.</p>
              </div>
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                Go to Login
              </Button>
            </div>
          )}

          <div className="flex items-start space-x-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Important:</strong> After creating the admin account, you should delete or restrict access to this
              setup page for security.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
