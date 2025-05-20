"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        })
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        router.push("/")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address to resend the confirmation email.",
      })
      return
    }

    setResendingEmail(true)

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/confirm?type=email`,
        },
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to send confirmation email.",
        })
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email to confirm your account.",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-black relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black bg-opacity-70 z-10">
          <div className="relative w-64 h-64 mb-6">
            <Image
              src="/images/Nothernchefslogo.png"
              alt="Northern Chefs Logo"
              fill
              priority
              sizes="(max-width: 768px) 0vw, 256px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <h2 className="text-gold font-schoolbell text-3xl text-center">A Taste of Home in every Jar.</h2>
        </div>
        <div className="absolute inset-0">
          <Image
            src="/images/background2.png"
            alt="Background"
            fill
            priority
            sizes="(max-width: 768px) 0vw, 50vw"
            style={{ objectFit: "cover", opacity: 0.5 }}
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/auth/reset-password" className="text-sm text-gold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="text-sm text-gold hover:underline"
                disabled={resendingEmail}
              >
                {resendingEmail ? "Sending..." : "Resend confirmation email"}
              </button>
            </div>

            <Button type="submit" className="w-full bg-gold hover:bg-amber-500 text-black" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-gold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
