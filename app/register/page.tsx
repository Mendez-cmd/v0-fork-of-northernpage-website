"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    favorites: [] as string[],
    referral: "",
    terms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Password requirements
  const requirements = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "At least 1 uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "At least 1 lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "At least 1 number", regex: /[0-9]/ },
    { id: "special", label: "At least 1 special character", regex: /[^A-Za-z0-9]/ },
  ]

  const checkPasswordStrength = (password: string) => {
    let strength = 0

    requirements.forEach((req) => {
      if (req.regex.test(password)) {
        strength++
      }
    })

    setPasswordStrength(strength)
    return strength
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked

      if (name === "terms") {
        setFormData({ ...formData, terms: checked })
      } else if (name === "favorites[]") {
        const favorites = [...formData.favorites]

        if (checked) {
          favorites.push(value)
        } else {
          const index = favorites.indexOf(value)
          if (index !== -1) {
            favorites.splice(index, 1)
          }
        }

        setFormData({ ...formData, favorites })
      }
    } else {
      setFormData({ ...formData, [name]: value })

      if (name === "password") {
        checkPasswordStrength(value)
      }
    }
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields.",
        })
        return
      }
    } else if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields.",
        })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
        })
        return
      }

      if (passwordStrength < 3) {
        toast({
          variant: "destructive",
          title: "Weak password",
          description: "Please create a stronger password.",
        })
        return
      }
    }

    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.terms) {
      toast({
        variant: "destructive",
        title: "Terms and Conditions",
        description: "Please accept the Terms and Conditions to continue.",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        favorites: formData.favorites,
        referral: formData.referral,
      })

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        })
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please check your email for verification.",
        })
        router.push("/login")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressWidth = () => {
    if (step === 1) return "0%"
    if (step === 2) return "50%"
    return "100%"
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-black relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black bg-opacity-70">
          <Image src="/images/Logo1.png" alt="Northern Chefs Logo" width={200} height={200} className="mb-6" />
          <h2 className="text-gold font-schoolbell text-3xl text-center">A Taste of Home in every Jar.</h2>
        </div>
        <Image src="/images/background2.png" alt="Background" fill className="object-cover opacity-50" />
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-500">Join our community and enjoy delicious homemade products</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-gold" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-gold text-black" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="text-xs mt-1">Personal Info</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-gold" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-gold text-black" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="text-xs mt-1">Account Setup</span>
              </div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-gold" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-gold text-black" : "bg-gray-200"}`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Preferences</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gold h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth() }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <Button type="button" onClick={nextStep} className="w-full bg-gold hover:bg-amber-500 text-black">
                  Next Step
                </Button>
              </>
            )}

            {/* Step 2: Account Setup */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
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

                  {/* Password strength indicator */}
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full ${
                            passwordStrength >= level
                              ? level <= 2
                                ? "bg-red-500"
                                : level <= 4
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {passwordStrength === 0
                        ? "Enter a password"
                        : passwordStrength <= 2
                          ? "Weak password"
                          : passwordStrength <= 4
                            ? "Medium password"
                            : "Strong password"}
                    </p>
                  </div>

                  {/* Password requirements */}
                  <div className="mt-2 space-y-1">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center text-xs">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            formData.password && req.regex.test(formData.password) ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="button" className="bg-gold hover:bg-amber-500 text-black" onClick={nextStep}>
                    Next Step
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What are your favorite products? (Optional)
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="chicken-pastil"
                          name="favorites[]"
                          value="chicken-pastil"
                          checked={formData.favorites.includes("chicken-pastil")}
                          onCheckedChange={(checked) => {
                            const newFavorites = [...formData.favorites]
                            if (checked) {
                              newFavorites.push("chicken-pastil")
                            } else {
                              const index = newFavorites.indexOf("chicken-pastil")
                              if (index !== -1) newFavorites.splice(index, 1)
                            }
                            setFormData({ ...formData, favorites: newFavorites })
                          }}
                        />
                        <label htmlFor="chicken-pastil" className="ml-2 text-sm">
                          Chicken Pastil
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="laing"
                          name="favorites[]"
                          value="laing"
                          checked={formData.favorites.includes("laing")}
                          onCheckedChange={(checked) => {
                            const newFavorites = [...formData.favorites]
                            if (checked) {
                              newFavorites.push("laing")
                            } else {
                              const index = newFavorites.indexOf("laing")
                              if (index !== -1) newFavorites.splice(index, 1)
                            }
                            setFormData({ ...formData, favorites: newFavorites })
                          }}
                        />
                        <label htmlFor="laing" className="ml-2 text-sm">
                          Laing
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="spanish-bangus"
                          name="favorites[]"
                          value="spanish-bangus"
                          checked={formData.favorites.includes("spanish-bangus")}
                          onCheckedChange={(checked) => {
                            const newFavorites = [...formData.favorites]
                            if (checked) {
                              newFavorites.push("spanish-bangus")
                            } else {
                              const index = newFavorites.indexOf("spanish-bangus")
                              if (index !== -1) newFavorites.splice(index, 1)
                            }
                            setFormData({ ...formData, favorites: newFavorites })
                          }}
                        />
                        <label htmlFor="spanish-bangus" className="ml-2 text-sm">
                          Spanish Bangus
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="chili-garlic"
                          name="favorites[]"
                          value="chili-garlic"
                          checked={formData.favorites.includes("chili-garlic")}
                          onCheckedChange={(checked) => {
                            const newFavorites = [...formData.favorites]
                            if (checked) {
                              newFavorites.push("chili-garlic")
                            } else {
                              const index = newFavorites.indexOf("chili-garlic")
                              if (index !== -1) newFavorites.splice(index, 1)
                            }
                            setFormData({ ...formData, favorites: newFavorites })
                          }}
                        />
                        <label htmlFor="chili-garlic" className="ml-2 text-sm">
                          Chili Garlic
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="referral" className="block text-sm font-medium">
                      How did you hear about us? (Optional)
                    </label>
                    <Input
                      id="referral"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      placeholder="Friend, Social Media, etc."
                    />
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, terms: !!checked })
                      }}
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm">
                      I agree to the{" "}
                      <a href="/terms" className="text-gold hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-gold hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" className="bg-gold hover:bg-amber-500 text-black" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
