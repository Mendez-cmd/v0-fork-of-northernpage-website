"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Info, LogOut, LogIn, UserPlus, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function TestAuthPage() {
  const { user, isLoading, isAdmin, signIn, signUp, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("status")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerFirstName, setRegisterFirstName] = useState("")
  const [registerLastName, setRegisterLastName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)

  // Logout state
  const [logoutSuccess, setLogoutSuccess] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setLoginSuccess(null)
    setIsLoggingIn(true)

    try {
      const { error } = await signIn(loginEmail, loginPassword)
      if (error) {
        setLoginError(error.message)
      } else {
        setLoginSuccess("Login successful!")
        // Clear form
        setLoginEmail("")
        setLoginPassword("")
      }
    } catch (error: any) {
      setLoginError(error?.message || "An unexpected error occurred")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError(null)
    setRegisterSuccess(null)
    setIsRegistering(true)

    try {
      const userData = {
        first_name: registerFirstName,
        last_name: registerLastName,
        phone: registerPhone,
      }

      const { error } = await signUp(registerEmail, registerPassword, userData)
      if (error) {
        setRegisterError(error.message)
      } else {
        setRegisterSuccess("Registration successful! Please check your email for verification.")
        // Clear form
        setRegisterEmail("")
        setRegisterPassword("")
        setRegisterFirstName("")
        setRegisterLastName("")
        setRegisterPhone("")
      }
    } catch (error: any) {
      setRegisterError(error?.message || "An unexpected error occurred")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleLogout = async () => {
    setLogoutSuccess(null)
    setIsLoggingOut(true)

    try {
      const { error } = await signOut()
      if (error) {
        console.error("Logout error:", error)
      } else {
        setLogoutSuccess("Logout successful!")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Authentication Test Page</h1>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="status">Auth Status</TabsTrigger>
            <TabsTrigger value="login">Login Test</TabsTrigger>
            <TabsTrigger value="register">Register Test</TabsTrigger>
          </TabsList>

          {/* Auth Status Tab */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
                <CardDescription>Current state of authentication in the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Loading authentication state...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                      <div className="mr-4">
                        {user ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Authentication Status</h3>
                        <p>{user ? "Authenticated" : "Not authenticated"}</p>
                      </div>
                    </div>

                    {user && (
                      <>
                        <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                          <div className="mr-4">
                            {isAdmin ? (
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : (
                              <Info className="h-8 w-8 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">Admin Status</h3>
                            <p>{isAdmin ? "Admin user" : "Regular user"}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg">
                          <h3 className="font-medium mb-2">User Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-gray-500">User ID</p>
                              <p className="text-sm font-mono break-all">{user.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="text-sm">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email Verified</p>
                              <p className="text-sm">{user.email_confirmed_at ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Last Sign In</p>
                              <p className="text-sm">
                                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
                              </p>
                            </div>
                          </div>

                          <h3 className="font-medium mt-4 mb-2">User Metadata</h3>
                          <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(user.user_metadata, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}

                    {!user && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Not authenticated</AlertTitle>
                        <AlertDescription>
                          You are not currently logged in. Use the Login or Register tabs to authenticate.
                        </AlertDescription>
                      </Alert>
                    )}

                    {logoutSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{logoutSuccess}</AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={refreshPage}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                {user ? (
                  <Button onClick={handleLogout} disabled={isLoggingOut} variant="destructive">
                    {isLoggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => setActiveTab("login")}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Go to Login
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Login Test Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login Test</CardTitle>
                <CardDescription>Test the login functionality</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Already logged in</AlertTitle>
                    <AlertDescription>
                      You are already logged in as {user.email}.
                      <Button variant="link" className="p-0 h-auto" onClick={handleLogout}>
                        Logout first
                      </Button>{" "}
                      to test login again.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    {loginError && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    {loginSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{loginSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                    Register here
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Test Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register Test</CardTitle>
                <CardDescription>Test the registration functionality</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Already logged in</AlertTitle>
                    <AlertDescription>
                      You are already logged in as {user.email}.
                      <Button variant="link" className="p-0 h-auto" onClick={handleLogout}>
                        Logout first
                      </Button>{" "}
                      to test registration.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="registerEmail" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="registerEmail"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="registerPassword" className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters long with uppercase, lowercase, number, and special
                        character.
                      </p>
                    </div>

                    {registerError && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    {registerSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{registerSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isRegistering}>
                      {isRegistering ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                    Login here
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Test navigation to see if authentication state persists across pages
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Home Page
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="sm">
                Products
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </Link>
            <Link href="/test-cart">
              <Button variant="outline" size="sm">
                Cart Test
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">Authentication Testing Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Use the <strong>Login Test</strong> tab to test signing in with existing credentials
            </li>
            <li>
              Use the <strong>Register Test</strong> tab to test creating a new account
            </li>
            <li>
              Check the <strong>Auth Status</strong> tab to view your current authentication state
            </li>
            <li>Navigate to other pages using the links above to verify that your authentication state persists</li>
            <li>Use the Logout button to test signing out</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
