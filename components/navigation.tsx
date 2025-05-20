"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const pathname = usePathname()
  const { items } = useCart()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setIsLoggedIn(!!session)

      if (session?.user) {
        setUserData(session.user)
      }

      setIsLoading(false)
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
      if (session?.user) {
        setUserData(session.user)
      } else {
        setUserData(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      })
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
      setIsLoggedIn(false)
      setUserData(null)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  // Get user's first name or email prefix
  const getUserDisplayName = () => {
    if (!userData) return ""

    // Try to get name from metadata
    if (userData.user_metadata?.first_name) {
      return userData.user_metadata.first_name
    }

    if (userData.user_metadata?.name) {
      return userData.user_metadata.name.split(" ")[0]
    }

    // Fall back to email prefix
    if (userData.email) {
      return userData.email.split("@")[0]
    }

    return "User"
  }

  // Get user's profile picture
  const getProfilePicture = () => {
    if (!userData) return null

    return userData.user_metadata?.profile_picture || null
  }

  return (
    <header className="bg-custom-dark text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="lg:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white hover:text-gold">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <ul className="hidden lg:flex items-center space-x-8">
          <li>
            <Link href="/" className={`hover:text-gold transition-colors ${isActive("/") ? "text-gold" : ""}`}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className={`hover:text-gold transition-colors ${isActive("/products") ? "text-gold" : ""}`}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/order"
              className={`hover:text-gold transition-colors ${isActive("/order") ? "text-gold" : ""}`}
            >
              Order
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`hover:text-gold transition-colors ${isActive("/contact") ? "text-gold" : ""}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="logo">
          <Link href="/">
            <Image src="/images/Logo2.png" alt="Northern Chefs Logo" width={150} height={60} className="h-12 w-auto" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <div className="hidden lg:flex items-center">
                  <span className="text-gold mr-2">Hello, {getUserDisplayName()}</span>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className={`text-white hover:text-gold ${isActive("/login") ? "text-gold" : ""}`}
                    >
                      Log-in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="ghost"
                      className={`text-white hover:text-gold ${isActive("/register") ? "text-gold" : ""}`}
                    >
                      Sign-up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}

          <Link href="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`text-white hover:text-gold ${isActive("/cart") ? "text-gold" : ""}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-gold relative">
                  {getProfilePicture() ? (
                    <Image
                      src={getProfilePicture() || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2">
                  {getProfilePicture() ? (
                    <Image
                      src={getProfilePicture() || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 object-cover mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black mr-2">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{getUserDisplayName()}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">{userData?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=orders" className="cursor-pointer w-full">
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=addresses" className="cursor-pointer w-full">
                    Addresses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=wishlist" className="cursor-pointer w-full">
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=reviews" className="cursor-pointer w-full">
                    Reviews
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=settings" className="cursor-pointer w-full">
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-700">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                <User className="h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-custom-dark bg-opacity-90 z-50 lg:hidden">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={closeMobileMenu} className="text-white hover:text-gold">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <ul className="flex flex-col items-center space-y-6 mt-10">
            {isLoggedIn && (
              <li className="mb-4">
                {getProfilePicture() ? (
                  <Image
                    src={getProfilePicture() || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full w-20 h-20 object-cover mb-2"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-black mb-2">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-xl text-gold text-center">Hello, {getUserDisplayName()}</div>
              </li>
            )}

            <li>
              <Link
                href="/"
                className={`text-xl hover:text-gold transition-colors ${isActive("/") ? "text-gold" : ""}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className={`text-xl hover:text-gold transition-colors ${isActive("/products") ? "text-gold" : ""}`}
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                className={`text-xl hover:text-gold transition-colors ${isActive("/order") ? "text-gold" : ""}`}
                onClick={closeMobileMenu}
              >
                Order
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={`text-xl hover:text-gold transition-colors ${isActive("/contact") ? "text-gold" : ""}`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </li>

            <div className="border-t border-gray-700 w-1/2 my-4"></div>

            {!isLoading && (
              <>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        href="/account"
                        className="text-xl hover:text-gold transition-colors"
                        onClick={closeMobileMenu}
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="text-xl text-white hover:text-gold"
                        onClick={() => {
                          handleLogout()
                          closeMobileMenu()
                        }}
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="text-xl hover:text-gold transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Log-in
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="text-xl hover:text-gold transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Sign-up
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
